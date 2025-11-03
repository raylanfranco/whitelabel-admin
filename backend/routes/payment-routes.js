// Payment API Routes for Stripe Integration
// Handles both SaaS subscription management and client payment processing

const express = require('express');
const { StripeService } = require('../services/StripeService');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth'); // Assume auth middleware exists

const router = express.Router();
const stripeService = new StripeService();

// Rate limiting
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 payment requests per windowMs
  message: 'Too many payment requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ========================================
// SAAS SUBSCRIPTION ROUTES
// ========================================

/**
 * POST /api/payments/subscriptions/create
 * Create new tenant subscription with setup fee
 */
router.post(
  '/subscriptions/create',
  paymentLimiter,
  auth.requireAuth,
  [
    body('tenantData.businessName').notEmpty().withMessage('Business name required'),
    body('tenantData.businessEmail').isEmail().withMessage('Valid business email required'),
    body('tenantData.businessPhone').isMobilePhone().withMessage('Valid phone number required'),
    body('subscriptionTier').isIn(['basic', 'premium']).withMessage('Valid subscription tier required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantData, subscriptionTier } = req.body;

      const result = await stripeService.createTenantSubscription(tenantData, subscriptionTier);

      res.json({
        success: true,
        customerId: result.customerId,
        subscriptionId: result.subscriptionId,
        clientSecret: result.clientSecret,
        status: result.status,
        trialEnd: result.trialEnd,
        setupFeeRequired: true
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription',
        message: error.message
      });
    }
  }
);

/**
 * PUT /api/payments/subscriptions/:tenantId/tier
 * Change subscription tier
 */
router.put(
  '/subscriptions/:tenantId/tier',
  paymentLimiter,
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    body('newTier').isIn(['basic', 'premium']).withMessage('Valid tier required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const { newTier } = req.body;

      const result = await stripeService.changeSubscriptionTier(tenantId, newTier);

      res.json({
        success: true,
        newTier: result.newTier,
        effective: result.effective,
        message: `Subscription upgraded to ${newTier} tier`
      });
    } catch (error) {
      console.error('Tier change error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change subscription tier',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/payments/subscriptions/:tenantId/status
 * Get subscription status and usage
 */
router.get(
  '/subscriptions/:tenantId/status',
  auth.requireAuth,
  auth.requireTenantAccess,
  [param('tenantId').isUUID().withMessage('Valid tenant ID required')],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;

      // Get subscription status
      const tenant = await stripeService.getTenant(tenantId);

      if (!tenant.stripeSubscriptionId) {
        return res.status(404).json({
          success: false,
          error: 'No subscription found'
        });
      }

      const subscription = await stripeService.stripe.subscriptions.retrieve(tenant.stripeSubscriptionId);

      // Get current month usage
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const usageReport = await stripeService.generateUsageReport(tenantId, currentMonth, currentYear);

      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          tier: subscription.metadata.subscription_tier,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          trialEnd: subscription.trial_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        },
        usage: usageReport,
        limits: tenant.usageLimits || {
          sms: subscription.metadata.subscription_tier === 'premium' ? 500 : 100,
          email: subscription.metadata.subscription_tier === 'premium' ? 10000 : 1000
        }
      });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get subscription status',
        message: error.message
      });
    }
  }
);

// ========================================
// CLIENT PAYMENT ROUTES
// ========================================

/**
 * POST /api/payments/:tenantId/process
 * Process client payment for services
 */
router.post(
  '/:tenantId/process',
  paymentLimiter,
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    body('amount').isFloat({ min: 0.50 }).withMessage('Amount must be at least $0.50'),
    body('clientId').isUUID().withMessage('Valid client ID required'),
    body('description').notEmpty().withMessage('Payment description required'),
    body('clientEmail').isEmail().withMessage('Valid client email required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const paymentData = req.body;

      const result = await stripeService.processClientPayment(tenantId, paymentData);

      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        transactionId: result.transactionId,
        amount: result.amount,
        platformFee: result.platformFee,
        netAmount: result.amount - result.platformFee
      });
    } catch (error) {
      console.error('Client payment processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process payment',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/payments/:tenantId/deposit
 * Process appointment deposit payment
 */
router.post(
  '/:tenantId/deposit',
  paymentLimiter,
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    body('appointmentId').isUUID().withMessage('Valid appointment ID required'),
    body('depositAmount').isFloat({ min: 0.50 }).withMessage('Deposit amount must be at least $0.50')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const { appointmentId, depositAmount } = req.body;

      const result = await stripeService.processDepositPayment(tenantId, appointmentId, depositAmount);

      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        transactionId: result.transactionId,
        amount: result.amount,
        type: 'deposit'
      });
    } catch (error) {
      console.error('Deposit payment processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process deposit',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/payments/:tenantId/refund
 * Process payment refund
 */
router.post(
  '/:tenantId/refund',
  paymentLimiter,
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    body('transactionId').isUUID().withMessage('Valid transaction ID required'),
    body('refundAmount').isFloat({ min: 0.01 }).withMessage('Refund amount must be positive'),
    body('reason').optional().isLength({ max: 500 }).withMessage('Reason too long')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const { transactionId, refundAmount, reason } = req.body;

      const result = await stripeService.processRefund(tenantId, transactionId, refundAmount, reason);

      res.json({
        success: true,
        refundId: result.refundId,
        amount: result.amount,
        message: 'Refund processed successfully'
      });
    } catch (error) {
      console.error('Refund processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process refund',
        message: error.message
      });
    }
  }
);

// ========================================
// STRIPE CONNECT ROUTES
// ========================================

/**
 * POST /api/payments/:tenantId/connect/setup
 * Setup Stripe Connect account for tenant
 */
router.post(
  '/:tenantId/connect/setup',
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    body('businessInfo.email').isEmail().withMessage('Valid business email required'),
    body('businessInfo.businessName').notEmpty().withMessage('Business name required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const { businessInfo } = req.body;

      const result = await stripeService.createConnectAccount(tenantId, businessInfo);

      res.json({
        success: true,
        accountId: result.accountId,
        onboardingUrl: result.onboardingUrl,
        status: result.status,
        message: 'Connect account created. Please complete onboarding.'
      });
    } catch (error) {
      console.error('Connect setup error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to setup Connect account',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/payments/:tenantId/connect/status
 * Get Connect account status
 */
router.get(
  '/:tenantId/connect/status',
  auth.requireAuth,
  auth.requireTenantAccess,
  [param('tenantId').isUUID().withMessage('Valid tenant ID required')],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;

      const tenant = await stripeService.getTenant(tenantId);

      if (!tenant.stripeConnectAccountId) {
        return res.json({
          success: true,
          status: 'not_created',
          message: 'Connect account not yet created'
        });
      }

      const status = await stripeService.getConnectAccountStatus(tenant.stripeConnectAccountId);

      res.json({
        success: true,
        accountId: status.id,
        status: status.status,
        chargesEnabled: status.chargesEnabled,
        payoutsEnabled: status.payoutsEnabled,
        detailsSubmitted: status.detailsSubmitted,
        requirements: status.requirements
      });
    } catch (error) {
      console.error('Connect status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get Connect status',
        message: error.message
      });
    }
  }
);

// ========================================
// FINANCIAL REPORTING ROUTES
// ========================================

/**
 * GET /api/payments/:tenantId/transactions
 * Get transaction history with filtering
 */
router.get(
  '/:tenantId/transactions',
  auth.requireAuth,
  auth.requireTenantAccess,
  [
    param('tenantId').isUUID().withMessage('Valid tenant ID required'),
    // Optional query parameters for filtering
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { tenantId } = req.params;
      const { startDate, endDate, type, status, limit = 50, offset = 0 } = req.query;

      // Build query filters
      let filters = `filters[tenant][id][$eq]=${tenantId}`;

      if (startDate) filters += `&filters[createdAt][$gte]=${startDate}`;
      if (endDate) filters += `&filters[createdAt][$lte]=${endDate}`;
      if (type) filters += `&filters[type][$eq]=${type}`;
      if (status) filters += `&filters[status][$eq]=${status}`;

      const response = await fetch(
        `${process.env.STRAPI_URL}/api/financial-transactions?${filters}&pagination[limit]=${limit}&pagination[start]=${offset}&sort[0]=createdAt:desc&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
          }
        }
      );

      const result = await response.json();

      res.json({
        success: true,
        transactions: result.data,
        pagination: result.meta?.pagination,
        summary: {
          total: result.meta?.pagination?.total || 0,
          totalAmount: result.data.reduce((sum, tx) => sum + (tx.attributes.amount || 0), 0)
        }
      });
    } catch (error) {
      console.error('Transaction history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get transaction history',
        message: error.message
      });
    }
  }
);

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Payment route error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;