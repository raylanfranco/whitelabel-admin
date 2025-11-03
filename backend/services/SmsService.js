// SMS Service for Multi-Tenant Twilio Integration
// Handles SMS sending, automation, and usage tracking

const twilio = require('twilio');
const { MultiTenantService } = require('./MultiTenantService');

class SmsService {
  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.businessPhone = process.env.TWILIO_PHONE_NUMBER;
  }

  // ========================================
  // CORE SMS SENDING METHODS
  // ========================================

  /**
   * Send SMS to client with usage tracking
   */
  async sendSms(tenantId, clientPhone, message, options = {}) {
    try {
      // Check tenant SMS limits
      const canSend = await MultiTenantService.checkSmsLimit(tenantId);
      if (!canSend.allowed) {
        throw new Error(`SMS limit exceeded: ${canSend.reason}`);
      }

      // Send SMS via Twilio
      const twilioMessage = await this.twilioClient.messages.create({
        body: message,
        from: this.businessPhone,
        to: clientPhone,
        ...options
      });

      // Log SMS in Strapi
      const smsLog = await this.logSms(tenantId, {
        twilioMessageSid: twilioMessage.sid,
        direction: 'outbound',
        messageType: options.messageType || 'manual',
        toNumber: clientPhone,
        fromNumber: this.businessPhone,
        messageBody: message,
        status: twilioMessage.status,
        segments: twilioMessage.numSegments || 1,
        cost: this.calculateSmsCost(twilioMessage.numSegments || 1),
        sentAt: new Date(),
        templateUsed: options.templateId,
        templateVariables: options.templateVariables,
        client: options.clientId,
        appointment: options.appointmentId,
        waitlistEntry: options.waitlistEntryId,
        automationTriggered: options.automated || false,
        automationRule: options.automationRule,
        priority: options.priority || 'normal',
        metadata: options.metadata
      });

      // Track usage
      await MultiTenantService.trackSmsUsage(tenantId, {
        messageId: twilioMessage.sid,
        segments: twilioMessage.numSegments || 1,
        cost: this.calculateSmsCost(twilioMessage.numSegments || 1),
        type: options.messageType || 'manual'
      });

      return {
        success: true,
        messageId: twilioMessage.sid,
        smsLogId: smsLog.data.id,
        segments: twilioMessage.numSegments || 1,
        status: twilioMessage.status
      };

    } catch (error) {
      console.error('SMS sending error:', error);

      // Log failed attempt
      await this.logSms(tenantId, {
        direction: 'outbound',
        messageType: options.messageType || 'manual',
        toNumber: clientPhone,
        fromNumber: this.businessPhone,
        messageBody: message,
        status: 'failed',
        errorMessage: error.message,
        client: options.clientId,
        appointment: options.appointmentId,
        metadata: { ...options.metadata, error: error.message }
      });

      throw error;
    }
  }

  /**
   * Send bulk SMS to multiple clients
   */
  async sendBulkSms(tenantId, recipients, message, options = {}) {
    const results = [];
    const batchSize = 10; // Process in batches to avoid rate limits

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (recipient) => {
        try {
          const result = await this.sendSms(tenantId, recipient.phone, message, {
            ...options,
            clientId: recipient.clientId,
            messageType: 'bulk',
            campaignId: options.campaignId
          });
          return { recipient, success: true, result };
        } catch (error) {
          return { recipient, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      total: recipients.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  // ========================================
  // AUTOMATED SMS TEMPLATES
  // ========================================

  /**
   * Send appointment reminder (24 hours before)
   */
  async sendAppointmentReminder(tenantId, appointment) {
    const template = await this.getTemplate(tenantId, 'appointment_reminder');
    const client = appointment.client;

    const message = this.processTemplate(template.content, {
      clientName: client.firstName,
      appointmentDate: this.formatDate(appointment.appointmentDate),
      appointmentTime: this.formatTime(appointment.startTime),
      serviceName: appointment.services?.map(s => s.name).join(', ') || 'Appointment',
      businessName: appointment.tenant.businessName,
      confirmText: 'Reply YES to confirm or NO to cancel'
    });

    return await this.sendSms(tenantId, client.phone, message, {
      messageType: 'reminder',
      clientId: client.id,
      appointmentId: appointment.id,
      automated: true,
      automationRule: 'appointment_reminder_24h',
      templateId: template.id,
      priority: 'high'
    });
  }

  /**
   * Send appointment confirmation request
   */
  async sendAppointmentConfirmation(tenantId, appointment) {
    const template = await this.getTemplate(tenantId, 'appointment_confirmation');
    const client = appointment.client;

    const message = this.processTemplate(template.content, {
      clientName: client.firstName,
      appointmentDate: this.formatDate(appointment.appointmentDate),
      appointmentTime: this.formatTime(appointment.startTime),
      serviceName: appointment.services?.map(s => s.name).join(', ') || 'Appointment',
      businessName: appointment.tenant.businessName,
      confirmText: 'Reply YES to confirm'
    });

    return await this.sendSms(tenantId, client.phone, message, {
      messageType: 'confirmation',
      clientId: client.id,
      appointmentId: appointment.id,
      automated: true,
      automationRule: 'appointment_confirmation',
      templateId: template.id,
      priority: 'high'
    });
  }

  /**
   * Send waitlist notification
   */
  async sendWaitlistNotification(tenantId, waitlistEntry, availableSlot) {
    const template = await this.getTemplate(tenantId, 'waitlist_notification');
    const client = waitlistEntry.client;

    const message = this.processTemplate(template.content, {
      clientName: client.firstName,
      availableDate: this.formatDate(availableSlot.date),
      availableTime: this.formatTime(availableSlot.time),
      serviceName: waitlistEntry.requestedServices?.map(s => s.name).join(', ') || 'Service',
      businessName: waitlistEntry.tenant.businessName,
      responseText: 'Reply ACCEPT to book or DECLINE to pass',
      expiresIn: '2 hours'
    });

    // Set response deadline
    const responseDeadline = new Date();
    responseDeadline.setHours(responseDeadline.getHours() + 2);

    // Update waitlist entry
    await this.updateWaitlistEntry(waitlistEntry.id, {
      status: 'notified',
      notificationSent: true,
      notificationSentAt: new Date(),
      responseDeadline
    });

    return await this.sendSms(tenantId, client.phone, message, {
      messageType: 'waitlist_notification',
      clientId: client.id,
      waitlistEntryId: waitlistEntry.id,
      automated: true,
      automationRule: 'waitlist_opening',
      templateId: template.id,
      priority: 'urgent',
      metadata: { responseDeadline, availableSlot }
    });
  }

  /**
   * Send payment receipt
   */
  async sendPaymentReceipt(tenantId, transaction) {
    const template = await this.getTemplate(tenantId, 'payment_receipt');
    const client = transaction.client;

    const message = this.processTemplate(template.content, {
      clientName: client.firstName,
      amount: `$${transaction.amount.toFixed(2)}`,
      paymentMethod: transaction.paymentMethod,
      serviceDescription: transaction.description,
      receiptNumber: transaction.receiptNumber,
      businessName: transaction.tenant.businessName,
      date: this.formatDate(transaction.processedAt)
    });

    return await this.sendSms(tenantId, client.phone, message, {
      messageType: 'receipt',
      clientId: client.id,
      automated: true,
      automationRule: 'payment_processed',
      templateId: template.id,
      metadata: { transactionId: transaction.id }
    });
  }

  // ========================================
  // TEMPLATE MANAGEMENT
  // ========================================

  async getTemplate(tenantId, templateType) {
    // Get tenant-specific template or fall back to default
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/sms-templates?filters[tenant][id][$eq]=${tenantId}&filters[templateType][$eq]=${templateType}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
        }
      }
    );

    const result = await response.json();

    if (result.data?.length > 0) {
      return result.data[0];
    }

    // Return default template
    return this.getDefaultTemplate(templateType);
  }

  getDefaultTemplate(templateType) {
    const templates = {
      appointment_reminder: {
        content: "Hi {{clientName}}! Reminder: You have an appointment for {{serviceName}} on {{appointmentDate}} at {{appointmentTime}}. {{confirmText}}. - {{businessName}}"
      },
      appointment_confirmation: {
        content: "Hi {{clientName}}! Please confirm your {{serviceName}} appointment on {{appointmentDate}} at {{appointmentTime}}. {{confirmText}}. - {{businessName}}"
      },
      waitlist_notification: {
        content: "Hi {{clientName}}! A {{serviceName}} slot opened up on {{availableDate}} at {{availableTime}}. {{responseText}} (expires in {{expiresIn}}). - {{businessName}}"
      },
      payment_receipt: {
        content: "Hi {{clientName}}! Payment received: {{amount}} via {{paymentMethod}} for {{serviceDescription}}. Receipt #{{receiptNumber}}. Thank you! - {{businessName}}"
      }
    };

    return templates[templateType] || { content: "Message from {{businessName}}" };
  }

  processTemplate(template, variables) {
    let message = template;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      message = message.replace(new RegExp(placeholder, 'g'), value || '');
    });

    return message.trim();
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  calculateSmsCost(segments = 1) {
    // Twilio US pricing: $0.0075 per segment
    return segments * 0.0075;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time) {
    // Handle both time string and datetime
    const timeObj = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : new Date(time);
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  async logSms(tenantId, smsData) {
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

  async updateWaitlistEntry(entryId, updateData) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/waitlist-entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: updateData })
    });

    return response.json();
  }
}

module.exports = { SmsService };