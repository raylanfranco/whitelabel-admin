// Multi-Tenant Service Architecture
// Centralized management of all third-party integrations

class MultiTenantService {
  constructor() {
    // Master API keys - stored securely in environment
    this.twilioClient = null
    this.sendGridClient = null
    this.googleCalendar = null
    this.supabaseClient = null

    // Usage tracking for all tenants
    this.usageTracker = new Map()

    this.initializeServices()
  }

  async initializeServices() {
    try {
      // Initialize Twilio with master account
      this.twilioClient = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )

      // Initialize SendGrid with master API key
      this.sendGridClient = require('@sendgrid/mail')
      this.sendGridClient.setApiKey(process.env.SENDGRID_API_KEY)

      // Initialize Google Calendar API
      const { google } = require('googleapis')
      this.googleCalendar = google.calendar('v3')

      // Initialize Supabase with master keys
      const { createClient } = require('@supabase/supabase-js')
      this.supabaseClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      )

      console.log('✅ All services initialized successfully')
    } catch (error) {
      console.error('❌ Service initialization failed:', error)
    }
  }

  // TWILIO SMS MANAGEMENT
  async sendSMS(tenantId, options) {
    try {
      // Check usage limits first
      if (!this.checkSMSUsage(tenantId)) {
        throw new Error('SMS limit exceeded for this tenant')
      }

      const { to, body, from } = options

      // Send SMS using master Twilio account
      const message = await this.twilioClient.messages.create({
        body: this.personalizeSMSForTenant(tenantId, body),
        from: from || process.env.TWILIO_PHONE_NUMBER,
        to: to,
        // Add tenant tracking in status callback
        statusCallback: `${process.env.API_BASE_URL}/webhooks/sms-status/${tenantId}`
      })

      // Track usage
      this.trackSMSUsage(tenantId, {
        messageId: message.sid,
        to: to,
        timestamp: new Date(),
        cost: 0.0075 // Approximate cost per SMS
      })

      return {
        success: true,
        messageId: message.sid,
        status: message.status
      }
    } catch (error) {
      console.error(`SMS failed for tenant ${tenantId}:`, error)
      return { success: false, error: error.message }
    }
  }

  // Handle incoming SMS responses (Y/N confirmations)
  async handleIncomingSMS(tenantId, messageData) {
    const { from, body, messageId } = messageData

    // Parse response (Y/N for appointment confirmations)
    const response = body.trim().toLowerCase()

    if (['y', 'yes', 'confirm'].includes(response)) {
      // Client confirmed - book the appointment
      await this.processAppointmentConfirmation(tenantId, from, true)

      // Send confirmation SMS
      await this.sendSMS(tenantId, {
        to: from,
        body: "Great! Your appointment is confirmed. We'll see you soon!"
      })

    } else if (['n', 'no', 'cancel'].includes(response)) {
      // Client declined - notify next person on waitlist
      await this.processAppointmentConfirmation(tenantId, from, false)
      await this.notifyNextWaitlistClient(tenantId)

      await this.sendSMS(tenantId, {
        to: from,
        body: "No problem! We've notified the next person on our waitlist."
      })
    }

    return { success: true, response: response }
  }

  // SENDGRID EMAIL MANAGEMENT
  async sendEmail(tenantId, options) {
    try {
      if (!this.checkEmailUsage(tenantId)) {
        throw new Error('Email limit exceeded for this tenant')
      }

      const { to, subject, html, attachments } = options

      const msg = {
        to: to,
        from: this.getTenantFromEmail(tenantId),
        subject: subject,
        html: this.personalizeEmailForTenant(tenantId, html),
        attachments: attachments || []
      }

      const response = await this.sendGridClient.send(msg)

      // Track usage
      this.trackEmailUsage(tenantId, {
        messageId: response[0].headers['x-message-id'],
        to: to,
        timestamp: new Date(),
        cost: 0.0001 // Approximate cost per email
      })

      return { success: true, messageId: response[0].headers['x-message-id'] }
    } catch (error) {
      console.error(`Email failed for tenant ${tenantId}:`, error)
      return { success: false, error: error.message }
    }
  }

  // GOOGLE CALENDAR INTEGRATION
  async syncAppointmentToCalendar(tenantId, appointmentData) {
    try {
      const { title, startTime, endTime, clientEmail, description } = appointmentData

      // Get tenant's Google Calendar credentials
      const tenantAuth = await this.getTenantGoogleAuth(tenantId)

      const event = {
        summary: title,
        description: description,
        start: {
          dateTime: startTime,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: endTime,
          timeZone: 'America/New_York'
        },
        attendees: [
          { email: clientEmail }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'popup', minutes: 30 }
          ]
        }
      }

      const response = await this.googleCalendar.events.insert({
        auth: tenantAuth,
        calendarId: 'primary',
        resource: event
      })

      return { success: true, eventId: response.data.id }
    } catch (error) {
      console.error(`Calendar sync failed for tenant ${tenantId}:`, error)
      return { success: false, error: error.message }
    }
  }

  // SUPABASE FILE STORAGE
  async uploadFile(tenantId, fileData, fileName) {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from('tenant-files')
        .upload(`${tenantId}/${fileName}`, fileData, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { publicURL } = this.supabaseClient.storage
        .from('tenant-files')
        .getPublicUrl(`${tenantId}/${fileName}`)

      return { success: true, url: publicURL }
    } catch (error) {
      console.error(`File upload failed for tenant ${tenantId}:`, error)
      return { success: false, error: error.message }
    }
  }

  // USAGE TRACKING & LIMITS
  checkSMSUsage(tenantId) {
    const usage = this.getUsage(tenantId)
    const monthlyLimit = this.getTenantSMSLimit(tenantId) // 100 for basic, 500 for premium

    return usage.sms.monthlyCount < monthlyLimit
  }

  checkEmailUsage(tenantId) {
    const usage = this.getUsage(tenantId)
    const monthlyLimit = this.getTenantEmailLimit(tenantId) // 1000 for basic, 10000 for premium

    return usage.email.monthlyCount < monthlyLimit
  }

  trackSMSUsage(tenantId, smsData) {
    if (!this.usageTracker.has(tenantId)) {
      this.usageTracker.set(tenantId, { sms: [], email: [] })
    }

    this.usageTracker.get(tenantId).sms.push(smsData)

    // Store in database for persistence
    this.saveUsageToDatabase(tenantId, 'sms', smsData)
  }

  trackEmailUsage(tenantId, emailData) {
    if (!this.usageTracker.has(tenantId)) {
      this.usageTracker.set(tenantId, { sms: [], email: [] })
    }

    this.usageTracker.get(tenantId).email.push(emailData)

    // Store in database for persistence
    this.saveUsageToDatabase(tenantId, 'email', emailData)
  }

  // TENANT CONFIGURATION
  getTenantFromEmail(tenantId) {
    // Return tenant's configured "from" email
    // e.g., "noreply@inkandart.com" or "appointments@clientstudio.com"
    return `noreply@${tenantId}.yoursaas.com`
  }

  getTenantSMSLimit(tenantId) {
    // Get from tenant subscription tier
    const tier = this.getTenantTier(tenantId)
    return tier === 'premium' ? 500 : 100
  }

  getTenantEmailLimit(tenantId) {
    const tier = this.getTenantTier(tenantId)
    return tier === 'premium' ? 10000 : 1000
  }

  personalizeSMSForTenant(tenantId, message) {
    const tenantInfo = this.getTenantInfo(tenantId)

    return message
      .replace('{businessName}', tenantInfo.businessName)
      .replace('{businessPhone}', tenantInfo.businessPhone)
      .replace('{businessAddress}', tenantInfo.businessAddress)
  }

  personalizeEmailForTenant(tenantId, html) {
    const tenantInfo = this.getTenantInfo(tenantId)

    return html
      .replace('{businessName}', tenantInfo.businessName)
      .replace('{businessLogo}', tenantInfo.businessLogo)
      .replace('{businessAddress}', tenantInfo.businessAddress)
      .replace('{businessWebsite}', tenantInfo.businessWebsite)
  }

  // UTILITY METHODS
  getUsage(tenantId) {
    const usage = this.usageTracker.get(tenantId) || { sms: [], email: [] }
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      sms: {
        monthlyCount: usage.sms.filter(s => new Date(s.timestamp) >= thisMonth).length,
        totalCost: usage.sms.reduce((sum, s) => sum + s.cost, 0)
      },
      email: {
        monthlyCount: usage.email.filter(e => new Date(e.timestamp) >= thisMonth).length,
        totalCost: usage.email.reduce((sum, e) => sum + e.cost, 0)
      }
    }
  }

  // Placeholder methods - implement with your database
  async getTenantInfo(tenantId) { /* Fetch from Strapi */ }
  async getTenantTier(tenantId) { /* Fetch subscription tier */ }
  async getTenantGoogleAuth(tenantId) { /* Get stored OAuth tokens */ }
  async saveUsageToDatabase(tenantId, type, data) { /* Save to Strapi */ }
  async processAppointmentConfirmation(tenantId, phone, confirmed) { /* Update appointment */ }
  async notifyNextWaitlistClient(tenantId) { /* Trigger waitlist notification */ }
}

// Export singleton instance
const multiTenantService = new MultiTenantService()
export default multiTenantService