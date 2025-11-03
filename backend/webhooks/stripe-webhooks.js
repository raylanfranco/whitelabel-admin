// Stripe Webhook Handlers for SaaS Billing and Client Payments
// Handles subscription events, payment processing, and Connect account updates

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { StripeService } = require('../services/StripeService');
const { SmsService } = require('../services/SmsService');
const { EmailService } = require('../services/EmailService');

class StripeWebhookHandler {
  constructor() {
    this.stripeService = new StripeService();
    this.smsService = new SmsService();
    this.emailService = new EmailService();
  }

  // ========================================
  // SUBSCRIPTION WEBHOOK HANDLERS
  // ========================================

  /**
   * Handle new subscription creation
   */
  async handleSubscriptionCreated(subscription) {
    try {
      const tenantId = subscription.metadata.tenant_id;

      await this.updateTenant(tenantId, {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionTier: subscription.metadata.subscription_tier || 'basic',
        setupCompleted: subscription.status === 'active'
      });

      // Send welcome email
      if (subscription.status === 'trialing' || subscription.status === 'active') {
        await this.sendWelcomeEmail(tenantId, subscription);
      }

      console.log(`Subscription created for tenant ${tenantId}:`, subscription.id);
    } catch (error) {
      console.error('Subscription creation webhook error:', error);
    }
  }

  /**
   * Handle subscription updates (tier changes, status changes)
   */
  async handleSubscriptionUpdated(subscription) {
    try {
      const tenantId = subscription.metadata.tenant_id;
      const previousAttributes = subscription.previous_attributes || {};

      // Update tenant subscription info
      await this.updateTenant(tenantId, {
        subscriptionStatus: subscription.status,
        subscriptionTier: subscription.metadata.subscription_tier || 'basic'
      });

      // Handle status changes
      if (previousAttributes.status !== subscription.status) {
        await this.handleSubscriptionStatusChange(tenantId, subscription, previousAttributes.status);
      }

      // Handle tier changes
      if (previousAttributes.metadata?.subscription_tier !== subscription.metadata.subscription_tier) {
        await this.handleTierChange(tenantId, subscription, previousAttributes.metadata?.subscription_tier);
      }

      console.log(`Subscription updated for tenant ${tenantId}:`, subscription.status);
    } catch (error) {
      console.error('Subscription update webhook error:', error);
    }
  }

  /**
   * Handle subscription cancellation
   */
  async handleSubscriptionDeleted(subscription) {
    try {
      const tenantId = subscription.metadata.tenant_id;

      await this.updateTenant(tenantId, {
        subscriptionStatus: 'cancelled',
        isActive: false
      });

      // Send cancellation confirmation email
      await this.sendCancellationEmail(tenantId, subscription);

      // Disable tenant services gradually
      await this.scheduleServiceDisabling(tenantId);

      console.log(`Subscription cancelled for tenant ${tenantId}`);
    } catch (error) {
      console.error('Subscription cancellation webhook error:', error);
    }
  }

  /**
   * Handle successful invoice payments
   */
  async handleInvoicePaymentSucceeded(invoice) {
    try {
      const tenantId = invoice.metadata.tenant_id;

      // Log successful payment
      await this.logFinancialTransaction(tenantId, {
        transactionId: invoice.payment_intent || invoice.id,
        type: 'payment',
        category: invoice.metadata.invoice_type === 'setup_fee' ? 'setup_fee' : 'subscription',
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        paymentMethod: 'credit_card',
        status: 'completed',
        description: invoice.description || 'SaaS subscription payment',
        processedAt: new Date(invoice.status_transitions.paid_at * 1000),
        receiptNumber: invoice.receipt_number,
        receiptGenerated: true,
        taxable: false, // SaaS fees typically not taxable for the business
        metadata: {
          stripe_invoice_id: invoice.id,
          billing_period: invoice.lines.data[0]?.period,
          invoice_type: invoice.metadata.invoice_type || 'subscription'
        }
      });

      // Handle setup fee completion
      if (invoice.metadata.invoice_type === 'setup_fee') {
        await this.completeSetupProcess(tenantId, invoice);
      }

      // Send payment receipt
      await this.sendPaymentReceipt(tenantId, invoice);

      console.log(`Payment succeeded for tenant ${tenantId}: $${invoice.amount_paid / 100}`);
    } catch (error) {
      console.error('Invoice payment success webhook error:', error);
    }
  }

  /**
   * Handle failed invoice payments
   */
  async handleInvoicePaymentFailed(invoice) {
    try {
      const tenantId = invoice.metadata.tenant_id;

      // Update tenant status
      await this.updateTenant(tenantId, {
        subscriptionStatus: 'past_due'
      });

      // Send payment failure notification
      await this.sendPaymentFailureNotification(tenantId, invoice);

      // Start dunning process
      await this.startDunningProcess(tenantId, invoice);

      console.log(`Payment failed for tenant ${tenantId}: $${invoice.amount_due / 100}`);
    } catch (error) {
      console.error('Invoice payment failure webhook error:', error);
    }
  }

  // ========================================
  // CLIENT PAYMENT WEBHOOK HANDLERS
  // ========================================

  /**
   * Handle successful client payments
   */
  async handlePaymentIntentSucceeded(paymentIntent) {
    try {
      const tenantId = paymentIntent.metadata.tenant_id;
      const clientId = paymentIntent.metadata.client_id;
      const appointmentId = paymentIntent.metadata.appointment_id;

      // Update transaction status
      await this.updateFinancialTransaction(paymentIntent.id, {
        status: 'completed',
        processedAt: new Date(),
        receiptGenerated: true
      });

      // Update appointment if deposit
      if (paymentIntent.metadata.payment_type === 'deposit' && appointmentId) {
        await this.updateAppointment(appointmentId, {
          depositPaid: true,
          depositPaidAt: new Date(),
          status: 'confirmed'
        });
      }

      // Send SMS receipt
      if (clientId) {
        const client = await this.getClient(clientId);
        if (client?.phone) {
          await this.smsService.sendPaymentReceipt(tenantId, {
            client,
            amount: paymentIntent.amount / 100,
            paymentMethod: 'Credit Card',
            description: paymentIntent.description,
            receiptNumber: paymentIntent.id
          });
        }
      }

      console.log(`Client payment succeeded: ${paymentIntent.id} - $${paymentIntent.amount / 100}`);
    } catch (error) {
      console.error('Payment intent success webhook error:', error);
    }
  }

  /**
   * Handle failed client payments
   */
  async handlePaymentIntentPaymentFailed(paymentIntent) {
    try {
      const tenantId = paymentIntent.metadata.tenant_id;
      const clientId = paymentIntent.metadata.client_id;

      // Update transaction status
      await this.updateFinancialTransaction(paymentIntent.id, {
        status: 'failed',
        errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed'
      });

      // Notify client and business
      await this.sendPaymentFailureNotifications(tenantId, clientId, paymentIntent);

      console.log(`Client payment failed: ${paymentIntent.id} - $${paymentIntent.amount / 100}`);
    } catch (error) {
      console.error('Payment intent failure webhook error:', error);
    }
  }

  // ========================================
  // STRIPE CONNECT WEBHOOK HANDLERS
  // ========================================

  /**
   * Handle Connect account updates
   */
  async handleAccountUpdated(account) {
    try {
      // Find tenant by Connect account ID
      const tenant = await this.getTenantByConnectAccount(account.id);

      if (!tenant) {
        console.log(`No tenant found for Connect account: ${account.id}`);
        return;
      }

      // Update payment processing status
      const paymentStatus = account.charges_enabled && account.payouts_enabled
        ? 'active'
        : account.details_submitted
          ? 'under_review'
          : 'pending';

      await this.updateTenant(tenant.id, {
        paymentProcessingStatus: paymentStatus,
        stripeConnectDetailsSubmitted: account.details_submitted,
        stripeConnectChargesEnabled: account.charges_enabled,
        stripeConnectPayoutsEnabled: account.payouts_enabled
      });

      // Send status update notification
      if (account.charges_enabled && account.payouts_enabled) {
        await this.sendPaymentProcessingActiveNotification(tenant.id);
      }

      console.log(`Connect account updated: ${account.id} - Status: ${paymentStatus}`);
    } catch (error) {
      console.error('Connect account update webhook error:', error);
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  async handleSubscriptionStatusChange(tenantId, subscription, previousStatus) {
    const statusMessages = {
      'active': 'Your subscription is now active! Welcome to the platform.',
      'past_due': 'Your payment is past due. Please update your payment method.',
      'canceled': 'Your subscription has been cancelled.',
      'unpaid': 'Your subscription is unpaid and will be cancelled soon.'
    };

    const message = statusMessages[subscription.status];
    if (message) {
      await this.sendStatusChangeNotification(tenantId, message, subscription.status);
    }

    // Handle specific status changes
    if (subscription.status === 'past_due') {
      await this.handlePastDueSubscription(tenantId, subscription);
    } else if (subscription.status === 'active' && previousStatus === 'past_due') {
      await this.handleSubscriptionReactivated(tenantId, subscription);
    }
  }

  async handleTierChange(tenantId, subscription, previousTier) {
    const newTier = subscription.metadata.subscription_tier;

    // Update usage limits
    await this.updateUsageLimits(tenantId, newTier);

    // Send tier change confirmation
    await this.sendTierChangeNotification(tenantId, previousTier, newTier);
  }

  async completeSetupProcess(tenantId, setupInvoice) {
    // Mark setup as completed
    await this.updateTenant(tenantId, {
      setupCompleted: true,
      onboardingStep: 5,
      setupFeeInvoiceId: setupInvoice.id,
      setupFeePaidAt: new Date()
    });

    // Trigger onboarding completion flow
    await this.triggerOnboardingCompletion(tenantId);
  }

  async startDunningProcess(tenantId, failedInvoice) {
    // Schedule reminder emails
    const reminderSchedule = [1, 3, 7]; // Days after failure

    for (const days of reminderSchedule) {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + days);

      // Schedule reminder (in production, use a job queue)
      setTimeout(async () => {
        await this.sendDunningReminder(tenantId, failedInvoice, days);
      }, days * 24 * 60 * 60 * 1000);
    }
  }

  async updateUsageLimits(tenantId, tier) {
    const limits = {
      basic: { sms: 100, email: 1000, storage: 5000 }, // 5GB
      premium: { sms: 500, email: 10000, storage: 25000 } // 25GB
    };

    await this.updateTenant(tenantId, {
      usageLimits: limits[tier] || limits.basic
    });
  }

  // Database helper methods
  async updateTenant(tenantId, updateData) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/tenants/${tenantId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: updateData })
    });

    return response.json();
  }

  async logFinancialTransaction(tenantId, transactionData) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/financial-transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          ...transactionData,
          tenant: tenantId
        }
      })
    });

    return response.json();
  }

  async updateFinancialTransaction(stripePaymentIntentId, updateData) {
    // Find transaction by Stripe payment intent ID
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/financial-transactions?filters[stripePaymentIntentId][$eq]=${stripePaymentIntentId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: updateData })
      }
    );

    return response.json();
  }

  async sendWelcomeEmail(tenantId, subscription) {
    // Implementation for welcome email
    console.log(`Sending welcome email to tenant ${tenantId}`);
  }

  async sendPaymentReceipt(tenantId, invoice) {
    // Implementation for payment receipt
    console.log(`Sending payment receipt to tenant ${tenantId}`);
  }

  async sendPaymentFailureNotification(tenantId, invoice) {
    // Implementation for payment failure notification
    console.log(`Sending payment failure notification to tenant ${tenantId}`);
  }
}

module.exports = { StripeWebhookHandler };