// Stripe Connect Service for Multi-Tenant Payment Processing
// Handles both SaaS subscription billing AND client payment processing

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MultiTenantService } = require('./MultiTenantService');

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  // ========================================
  // SAAS SUBSCRIPTION MANAGEMENT
  // ========================================

  /**
   * Create new tenant with Stripe customer and subscription
   */
  async createTenantSubscription(tenantData, subscriptionTier = 'basic') {
    try {
      // Create Stripe customer for the business owner
      const customer = await this.stripe.customers.create({
        name: tenantData.businessName,
        email: tenantData.businessEmail,
        phone: tenantData.businessPhone,
        metadata: {
          tenant_id: tenantData.id || 'pending',
          business_type: tenantData.businessType || 'service_business',
          onboarding_step: '1'
        }
      });

      // Get price ID based on subscription tier
      const priceId = this.getSubscriptionPriceId(subscriptionTier);

      // Create subscription with trial period
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: 14, // 14-day free trial
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          tenant_id: tenantData.id || 'pending',
          subscription_tier: subscriptionTier,
          setup_fee_required: 'true'
        }
      });

      // Create one-time setup fee invoice
      await this.createSetupFeeInvoice(customer.id, tenantData.id);

      return {
        customerId: customer.id,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
        status: subscription.status,
        trialEnd: subscription.trial_end,
        currentPeriodEnd: subscription.current_period_end
      };

    } catch (error) {
      console.error('Stripe tenant creation error:', error);
      throw new Error(`Failed to create Stripe subscription: ${error.message}`);
    }
  }

  /**
   * Create $2,500 setup fee invoice
   */
  async createSetupFeeInvoice(customerId, tenantId) {
    const setupFee = await this.stripe.invoiceItems.create({
      customer: customerId,
      amount: 250000, // $2,500.00 in cents
      currency: 'usd',
      description: 'One-time platform setup and configuration fee',
      metadata: {
        tenant_id: tenantId,
        fee_type: 'setup',
        service_description: 'Complete admin panel setup, branding, and onboarding'
      }
    });

    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      collection_method: 'charge_automatically',
      auto_advance: true,
      metadata: {
        tenant_id: tenantId,
        invoice_type: 'setup_fee'
      }
    });

    return { invoiceId: invoice.id, setupFeeId: setupFee.id };
  }

  /**
   * Handle subscription tier changes
   */
  async changeSubscriptionTier(tenantId, newTier) {
    try {
      const tenant = await this.getTenant(tenantId);
      const subscription = await this.stripe.subscriptions.retrieve(tenant.stripeSubscriptionId);

      const newPriceId = this.getSubscriptionPriceId(newTier);

      // Update subscription item
      await this.stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations',
        metadata: {
          ...subscription.metadata,
          subscription_tier: newTier,
          tier_change_date: new Date().toISOString()
        }
      });

      // Update tenant in Strapi
      await this.updateTenant(tenantId, {
        subscriptionTier: newTier,
        subscriptionStatus: 'active'
      });

      return { success: true, newTier, effective: 'immediately' };
    } catch (error) {
      console.error('Subscription tier change error:', error);
      throw error;
    }
  }

  // ========================================
  // CLIENT PAYMENT PROCESSING
  // ========================================

  /**
   * Process client payment for appointments/services
   */
  async processClientPayment(tenantId, paymentData) {
    try {
      // Get tenant's Stripe account (for Connect)
      const tenant = await this.getTenant(tenantId);

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        application_fee_amount: this.calculatePlatformFee(paymentData.amount),
        transfer_data: {
          destination: tenant.stripeConnectAccountId,
        },
        metadata: {
          tenant_id: tenantId,
          client_id: paymentData.clientId,
          appointment_id: paymentData.appointmentId,
          service_ids: JSON.stringify(paymentData.serviceIds || []),
          payment_type: paymentData.paymentType || 'service_payment'
        },
        receipt_email: paymentData.clientEmail,
        description: paymentData.description || 'Service payment'
      });

      // Log transaction in Strapi
      const transaction = await this.logFinancialTransaction(tenantId, {
        transactionId: paymentIntent.id,
        type: 'payment',
        category: 'service_payment',
        amount: paymentData.amount,
        currency: 'usd',
        paymentMethod: 'credit_card',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        processingFee: this.calculatePlatformFee(paymentData.amount) / 100,
        netAmount: paymentData.amount - (this.calculatePlatformFee(paymentData.amount) / 100),
        description: paymentData.description,
        client: paymentData.clientId,
        appointment: paymentData.appointmentId,
        service: paymentData.serviceIds?.[0],
        taxable: true,
        taxCategory: 'service_income',
        quarterlyPeriod: this.getQuarterlyPeriod(),
        fiscalYear: new Date().getFullYear()
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        transactionId: transaction.data.id,
        amount: paymentData.amount,
        platformFee: this.calculatePlatformFee(paymentData.amount) / 100,
        status: 'pending'
      };

    } catch (error) {
      console.error('Client payment processing error:', error);
      throw error;
    }
  }

  /**
   * Process deposit payment
   */
  async processDepositPayment(tenantId, appointmentId, depositAmount) {
    const appointment = await this.getAppointment(appointmentId);

    return await this.processClientPayment(tenantId, {
      amount: depositAmount,
      clientId: appointment.client.id,
      appointmentId: appointmentId,
      serviceIds: appointment.services?.map(s => s.id) || [],
      paymentType: 'deposit',
      description: `Deposit for ${appointment.services?.map(s => s.name).join(', ') || 'appointment'}`,
      clientEmail: appointment.client.email
    });
  }

  /**
   * Process refund
   */
  async processRefund(tenantId, transactionId, refundAmount, reason) {
    try {
      const transaction = await this.getTransaction(transactionId);

      const refund = await this.stripe.refunds.create({
        payment_intent: transaction.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100),
        reason: reason || 'requested_by_customer',
        metadata: {
          tenant_id: tenantId,
          original_transaction_id: transactionId,
          refund_reason: reason
        }
      });

      // Log refund transaction
      await this.logFinancialTransaction(tenantId, {
        transactionId: refund.id,
        type: 'refund',
        category: 'service_refund',
        amount: refundAmount,
        currency: 'usd',
        status: 'completed',
        description: `Refund for ${transaction.description}`,
        client: transaction.client.id,
        appointment: transaction.appointment?.id,
        refundAmount: refundAmount,
        refundReason: reason,
        processedAt: new Date()
      });

      // Update original transaction
      await this.updateTransaction(transactionId, {
        status: 'refunded',
        refundedAt: new Date(),
        refundAmount: refundAmount,
        refundReason: reason
      });

      return { success: true, refundId: refund.id, amount: refundAmount };
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }

  // ========================================
  // STRIPE CONNECT SETUP
  // ========================================

  /**
   * Create Stripe Connect account for tenant
   */
  async createConnectAccount(tenantId, businessInfo) {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: businessInfo.email,
        business_type: 'individual', // Most tattoo/esthetic businesses
        metadata: {
          tenant_id: tenantId,
          business_name: businessInfo.businessName
        }
      });

      // Create account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/settings/payments?refresh=true`,
        return_url: `${process.env.FRONTEND_URL}/settings/payments?success=true`,
        type: 'account_onboarding',
      });

      // Update tenant with Connect account ID
      await this.updateTenant(tenantId, {
        stripeConnectAccountId: account.id,
        paymentProcessingStatus: 'onboarding'
      });

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
        status: 'pending_verification'
      };
    } catch (error) {
      console.error('Connect account creation error:', error);
      throw error;
    }
  }

  /**
   * Check Connect account status
   */
  async getConnectAccountStatus(accountId) {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);

      return {
        id: account.id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
        requirements: account.requirements,
        status: account.charges_enabled ? 'active' : 'pending'
      };
    } catch (error) {
      console.error('Connect account status error:', error);
      return null;
    }
  }

  // ========================================
  // USAGE TRACKING & BILLING
  // ========================================

  /**
   * Calculate platform fee (3% + $0.30)
   */
  calculatePlatformFee(amount) {
    // 3% + $0.30 platform fee (in cents)
    return Math.round((amount * 0.03 + 0.30) * 100);
  }

  /**
   * Get subscription pricing
   */
  getSubscriptionPriceId(tier) {
    const priceIds = {
      basic: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_250', // $250/month
      premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_500' // $500/month
    };

    return priceIds[tier] || priceIds.basic;
  }

  /**
   * Generate monthly usage report
   */
  async generateUsageReport(tenantId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get SMS usage
    const smsUsage = await this.getSmsUsage(tenantId, startDate, endDate);

    // Get email usage
    const emailUsage = await this.getEmailUsage(tenantId, startDate, endDate);

    // Get transaction volume
    const transactionVolume = await this.getTransactionVolume(tenantId, startDate, endDate);

    return {
      tenantId,
      period: { month, year, startDate, endDate },
      sms: {
        sent: smsUsage.count,
        cost: smsUsage.totalCost,
        limitUsed: smsUsage.limitUsed
      },
      email: {
        sent: emailUsage.count,
        limitUsed: emailUsage.limitUsed
      },
      transactions: {
        count: transactionVolume.count,
        totalAmount: transactionVolume.totalAmount,
        platformFees: transactionVolume.platformFees
      }
    };
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  getQuarterlyPeriod() {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
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

  async updateTransaction(transactionId, updateData) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/financial-transactions/${transactionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: updateData })
    });

    return response.json();
  }

  async getTenant(tenantId) {
    const response = await fetch(`${process.env.STRAPI_URL}/api/tenants/${tenantId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      }
    });

    const result = await response.json();
    return result.data;
  }

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
}

module.exports = { StripeService };