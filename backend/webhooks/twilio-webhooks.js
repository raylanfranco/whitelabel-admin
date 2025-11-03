// Twilio Webhook Handlers for Multi-Tenant SMS Integration
// Handles incoming SMS, delivery status, and automated responses

const twilio = require('twilio');
const { MultiTenantService } = require('../services/MultiTenantService');

class TwilioWebhookHandler {
  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  // POST /webhooks/sms-status/{tenantId}
  async handleSmsStatus(req, res) {
    try {
      const { tenantId } = req.params;
      const {
        MessageSid,
        MessageStatus,
        ErrorCode,
        ErrorMessage,
        To,
        From,
        SmsStatus
      } = req.body;

      // Verify webhook authenticity
      const isValid = this.verifyWebhook(req);
      if (!isValid) {
        return res.status(401).json({ error: 'Unauthorized webhook' });
      }

      // Update SMS log in Strapi
      await this.updateSmsLog(tenantId, {
        twilioMessageSid: MessageSid,
        status: MessageStatus || SmsStatus,
        errorCode: ErrorCode,
        errorMessage: ErrorMessage,
        deliveredAt: MessageStatus === 'delivered' ? new Date() : null
      });

      // Track usage for tenant
      await MultiTenantService.trackSmsUsage(tenantId, {
        messageId: MessageSid,
        status: MessageStatus,
        errorCode: ErrorCode
      });

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('SMS Status Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // POST /webhooks/sms-incoming/{tenantId}
  async handleIncomingSms(req, res) {
    try {
      const { tenantId } = req.params;
      const {
        MessageSid,
        From,
        To,
        Body,
        NumMedia,
        MediaUrl0,
        MediaContentType0
      } = req.body;

      // Verify webhook authenticity
      const isValid = this.verifyWebhook(req);
      if (!isValid) {
        return res.status(401).json({ error: 'Unauthorized webhook' });
      }

      // Find client by phone number
      const client = await this.findClientByPhone(tenantId, From);
      if (!client) {
        // Log unknown sender but don't respond
        await this.logIncomingSms(tenantId, {
          twilioMessageSid: MessageSid,
          fromNumber: From,
          toNumber: To,
          messageBody: Body,
          direction: 'inbound',
          status: 'received',
          receivedAt: new Date(),
          metadata: { unknownSender: true }
        });
        return res.status(200).json({ received: true });
      }

      // Log incoming SMS
      const smsLog = await this.logIncomingSms(tenantId, {
        twilioMessageSid: MessageSid,
        fromNumber: From,
        toNumber: To,
        messageBody: Body,
        direction: 'inbound',
        status: 'received',
        receivedAt: new Date(),
        client: client.id,
        metadata: {
          numMedia: NumMedia,
          mediaUrl: MediaUrl0,
          mediaType: MediaContentType0
        }
      });

      // Process automated responses
      const response = await this.processAutomatedResponse(tenantId, client, Body, smsLog);

      if (response) {
        // Send automated response via Twilio
        const message = await this.twilioClient.messages.create({
          body: response.message,
          from: To, // Business phone number
          to: From  // Client phone number
        });

        // Log outbound response
        await this.logIncomingSms(tenantId, {
          twilioMessageSid: message.sid,
          fromNumber: To,
          toNumber: From,
          messageBody: response.message,
          direction: 'outbound',
          messageType: 'automated_response',
          status: 'sent',
          sentAt: new Date(),
          client: client.id,
          automationTriggered: true,
          automationRule: response.rule,
          metadata: { responseToMessage: MessageSid }
        });
      }

      res.status(200).json({ received: true, automated: !!response });
    } catch (error) {
      console.error('Incoming SMS Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Process Y/N confirmations and automated responses
  async processAutomatedResponse(tenantId, client, messageBody, originalSmsLog) {
    const normalizedMessage = messageBody.toLowerCase().trim();

    // Appointment confirmation responses
    if (['yes', 'y', 'confirm', 'confirmed'].includes(normalizedMessage)) {
      return await this.handleAppointmentConfirmation(tenantId, client, true);
    }

    if (['no', 'n', 'cancel', 'cancelled'].includes(normalizedMessage)) {
      return await this.handleAppointmentConfirmation(tenantId, client, false);
    }

    // Waitlist responses
    if (['accept', 'yes please', 'book it'].includes(normalizedMessage)) {
      return await this.handleWaitlistResponse(tenantId, client, 'accepted');
    }

    if (['decline', 'not available', 'pass'].includes(normalizedMessage)) {
      return await this.handleWaitlistResponse(tenantId, client, 'declined');
    }

    // Common questions - auto-responses
    const autoResponses = {
      'hours': await this.getBusinessHours(tenantId),
      'location': await this.getBusinessAddress(tenantId),
      'prices': 'Please check our website or call for current pricing. We\'d be happy to discuss your needs!',
      'booking': 'You can book online at our website or give us a call. What service are you interested in?'
    };

    for (const [keyword, response] of Object.entries(autoResponses)) {
      if (normalizedMessage.includes(keyword)) {
        return {
          message: response,
          rule: `auto_response_${keyword}`
        };
      }
    }

    return null; // No automated response
  }

  async handleAppointmentConfirmation(tenantId, client, confirmed) {
    // Find pending appointment for client
    const pendingAppointment = await this.findPendingAppointment(tenantId, client.id);

    if (!pendingAppointment) {
      return {
        message: "We don't see any pending appointments to confirm. Please call if you need assistance!",
        rule: 'no_pending_appointment'
      };
    }

    if (confirmed) {
      // Update appointment status
      await this.updateAppointmentStatus(pendingAppointment.id, 'confirmed', {
        clientConfirmed: true,
        clientConfirmedAt: new Date()
      });

      return {
        message: `Perfect! Your appointment on ${this.formatAppointmentDate(pendingAppointment)} is confirmed. See you then!`,
        rule: 'appointment_confirmed'
      };
    } else {
      // Handle cancellation
      await this.updateAppointmentStatus(pendingAppointment.id, 'cancelled', {
        cancelledBy: 'client',
        cancelledAt: new Date(),
        cancellationReason: 'Client cancelled via SMS'
      });

      // Trigger waitlist notification
      await this.triggerWaitlistNotification(tenantId, pendingAppointment);

      return {
        message: `Your appointment has been cancelled. Thanks for letting us know! We'll be in touch soon.`,
        rule: 'appointment_cancelled'
      };
    }
  }

  async handleWaitlistResponse(tenantId, client, response) {
    const waitlistEntry = await this.findActiveWaitlistEntry(tenantId, client.id);

    if (!waitlistEntry) {
      return {
        message: "We don't see any waitlist notifications for you. Please call if you'd like to join our waitlist!",
        rule: 'no_waitlist_entry'
      };
    }

    if (response === 'accepted') {
      // Book the appointment
      const appointment = await this.bookWaitlistAppointment(waitlistEntry);

      await this.updateWaitlistStatus(waitlistEntry.id, 'booked', {
        clientResponse: 'accepted',
        clientResponseAt: new Date(),
        resultingAppointment: appointment.id
      });

      return {
        message: `Fantastic! We've booked your appointment for ${this.formatAppointmentDate(appointment)}. Confirmation details coming soon!`,
        rule: 'waitlist_accepted'
      };
    } else {
      // Mark as declined
      await this.updateWaitlistStatus(waitlistEntry.id, 'declined', {
        clientResponse: 'declined',
        clientResponseAt: new Date()
      });

      return {
        message: `No problem! We'll keep you on the waitlist and reach out with the next available slot.`,
        rule: 'waitlist_declined'
      };
    }
  }

  // Verify Twilio webhook signature
  verifyWebhook(req) {
    const twilioSignature = req.headers['x-twilio-signature'];
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    return twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      twilioSignature,
      url,
      req.body
    );
  }

  // Helper methods for database operations
  async updateSmsLog(tenantId, updateData) {
    // Update SMS log in Strapi by twilioMessageSid
    const response = await fetch(`${process.env.STRAPI_URL}/api/sms-logs`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: updateData,
        filters: {
          twilioMessageSid: updateData.twilioMessageSid,
          tenant: tenantId
        }
      })
    });

    return response.json();
  }

  async logIncomingSms(tenantId, smsData) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/sms-logs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          ...smsData,
          tenant: tenantId
        }
      })
    });

    return response.json();
  }

  async findClientByPhone(tenantId, phoneNumber) {
    // Clean phone number for matching
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    const response = await fetch(
      `${process.env.STRAPI_URL}/api/clients?filters[phone][$contains]=${cleanPhone}&filters[tenant][id][$eq]=${tenantId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
        }
      }
    );

    const result = await response.json();
    return result.data?.[0] || null;
  }

  async findPendingAppointment(tenantId, clientId) {
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/appointments?filters[client][id][$eq]=${clientId}&filters[tenant][id][$eq]=${tenantId}&filters[status][$eq]=scheduled&filters[appointmentDate][$gte]=${new Date().toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
        }
      }
    );

    const result = await response.json();
    return result.data?.[0] || null;
  }

  formatAppointmentDate(appointment) {
    const date = new Date(appointment.appointmentDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}

module.exports = { TwilioWebhookHandler };