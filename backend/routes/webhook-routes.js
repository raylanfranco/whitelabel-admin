// Express Routes for Twilio and Other Webhook Endpoints
// Multi-tenant webhook handling with proper authentication and error handling

const express = require('express');
const { TwilioWebhookHandler } = require('../webhooks/twilio-webhooks');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const twilioHandler = new TwilioWebhookHandler();

// Rate limiting for webhook endpoints
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many webhook requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware for webhook body parsing (Twilio sends form-encoded data)
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Validation middleware
const validateTenantId = [
  param('tenantId').isUUID().withMessage('Invalid tenant ID format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ========================================
// TWILIO SMS WEBHOOKS
// ========================================

/**
 * POST /webhooks/sms-status/{tenantId}
 * Handles SMS delivery status updates from Twilio
 */
router.post(
  '/sms-status/:tenantId',
  webhookLimiter,
  validateTenantId,
  [
    body('MessageSid').notEmpty().withMessage('MessageSid is required'),
    body('MessageStatus').optional().isIn([
      'queued', 'sending', 'sent', 'delivered', 'failed', 'undelivered'
    ]).withMessage('Invalid message status'),
    body('To').isMobilePhone().withMessage('Invalid To phone number'),
    body('From').isMobilePhone().withMessage('Invalid From phone number')
  ],
  async (req, res) => {
    try {
      await twilioHandler.handleSmsStatus(req, res);
    } catch (error) {
      console.error('SMS Status Webhook Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /webhooks/sms-incoming/{tenantId}
 * Handles incoming SMS messages from clients
 */
router.post(
  '/sms-incoming/:tenantId',
  webhookLimiter,
  validateTenantId,
  [
    body('MessageSid').notEmpty().withMessage('MessageSid is required'),
    body('From').isMobilePhone().withMessage('Invalid From phone number'),
    body('To').isMobilePhone().withMessage('Invalid To phone number'),
    body('Body').optional().isLength({ max: 1600 }).withMessage('Message body too long')
  ],
  async (req, res) => {
    try {
      await twilioHandler.handleIncomingSms(req, res);
    } catch (error) {
      console.error('Incoming SMS Webhook Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ========================================
// STRIPE WEBHOOKS
// ========================================

/**
 * POST /webhooks/stripe
 * Handles Stripe webhook events for subscription and payment processing
 */
router.post(
  '/stripe',
  webhookLimiter,
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      await handleStripeWebhook(event);
      res.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

// ========================================
// SENDGRID WEBHOOKS
// ========================================

/**
 * POST /webhooks/sendgrid/{tenantId}
 * Handles SendGrid email event webhooks
 */
router.post(
  '/sendgrid/:tenantId',
  webhookLimiter,
  validateTenantId,
  async (req, res) => {
    try {
      // SendGrid sends events as an array
      const events = req.body;

      for (const event of events) {
        await handleSendGridEvent(req.params.tenantId, event);
      }

      res.status(200).json({ processed: events.length });
    } catch (error) {
      console.error('SendGrid webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================

/**
 * GET /webhooks/health
 * Health check endpoint for webhook monitoring
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      'sms-status': '/webhooks/sms-status/:tenantId',
      'sms-incoming': '/webhooks/sms-incoming/:tenantId',
      'stripe': '/webhooks/stripe',
      'sendgrid': '/webhooks/sendgrid/:tenantId'
    }
  });
});

// ========================================
// WEBHOOK HELPER FUNCTIONS
// ========================================

async function handleStripeWebhook(event) {
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    case 'customer.created':
      await handleCustomerCreated(event.data.object);
      break;

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }
}

async function handleSendGridEvent(tenantId, event) {
  const updateData = {
    sendgridMessageId: event.sg_message_id,
    status: mapSendGridStatus(event.event),
    tenant: tenantId
  };

  // Add event-specific data
  switch (event.event) {
    case 'delivered':
      updateData.deliveredAt = new Date(event.timestamp * 1000);
      break;
    case 'open':
      updateData.openedAt = new Date(event.timestamp * 1000);
      updateData.openCount = (updateData.openCount || 0) + 1;
      updateData.userAgent = event.useragent;
      updateData.ipAddress = event.ip;
      break;
    case 'click':
      updateData.firstClickAt = updateData.firstClickAt || new Date(event.timestamp * 1000);
      updateData.lastClickAt = new Date(event.timestamp * 1000);
      updateData.clickCount = (updateData.clickCount || 0) + 1;
      break;
    case 'bounce':
      updateData.bounceReason = event.reason;
      break;
    case 'unsubscribe':
      updateData.unsubscribed = true;
      updateData.unsubscribedAt = new Date(event.timestamp * 1000);
      break;
  }

  // Update email log in Strapi
  await updateEmailLog(updateData);
}

function mapSendGridStatus(sendGridEvent) {
  const statusMap = {
    'processed': 'queued',
    'delivered': 'delivered',
    'open': 'opened',
    'click': 'clicked',
    'bounce': 'bounced',
    'dropped': 'failed',
    'deferred': 'sending',
    'unsubscribe': 'unsubscribed',
    'spamreport': 'spam'
  };

  return statusMap[sendGridEvent] || sendGridEvent;
}

async function updateEmailLog(updateData) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/email-logs`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: updateData,
      filters: {
        sendgridMessageId: updateData.sendgridMessageId,
        tenant: updateData.tenant
      }
    })
  });

  return response.json();
}

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Webhook route error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;