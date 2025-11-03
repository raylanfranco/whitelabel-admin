# 🗄️ Strapi Schema Overview - Multi-Tenant SaaS Admin Panel

## 📦 Core Collections (12 Collections)

### **Business & Client Management**
- **`tenant.json`** - Business/studio tenants using the platform
- **`client.json`** - Customer/client profiles for each tenant
- **`conversation.json`** - Client conversation threads and messaging

### **Scheduling & Services**
- **`appointment.json`** - Client appointments and bookings
- **`service.json`** - Services offered by the business
- **`waitlist-entry.json`** - Client waitlist entries for appointment availability

### **Forms & Documentation**
- **`form.json`** - Custom forms and intake questionnaires
- **`form-submission.json`** - Client form responses and submissions
- **`consent-form.json`** - Digital consent forms and legal documents
- **`signature.json`** - Digital signatures for consent forms and legal documents

### **Financial & Communication**
- **`financial-transaction.json`** - Payment transactions and financial records
- **`sms-log.json`** - SMS message tracking and communication logs
- **`email-log.json`** - Email communication tracking and delivery logs

## ⚙️ Configuration Collections (4 Collections)

### **System Configuration**
- **`service-category.json`** - Categories for organizing services
- **`form-template.json`** - Predefined form templates for quick form creation
- **`theme.json`** - UI themes and branding configurations
- **`business-setting.json`** - Business configuration and operational settings

## 🔗 Key Relationships

### **Multi-Tenant Architecture**
- All core collections reference `tenantId` for data isolation
- Tenants have one-to-many relationships with all client-facing data

### **Client-Centric Relationships**
```
Client (1) → Appointments (N)
Client (1) → Form Submissions (N)
Client (1) → Waitlist Entries (N)
Client (1) → Signatures (N)
Client (1) → Transactions (N)
Client (1) → Conversations (N)
```

### **Service & Booking Flow**
```
Service (N) ↔ Appointments (M) - Many-to-many relationship
Appointment (1) → Transactions (N)
Appointment (1) → SMS/Email Logs (N)
Service (N) → Categories (1)
```

### **Form & Consent Management**
```
Form (1) → Form Submissions (N)
Consent Form (1) → Signatures (N)
Form Template (1) → Forms (N)
```

### **Communication Tracking**
```
Conversation (1) → SMS Logs (N)
Client (1) → Conversations (N)
Appointment (1) → SMS/Email Logs (N)
```

## 🚀 Installation Instructions

### **Option 1: Manual Schema Creation**
Copy each `.json` file to your Strapi project:
```bash
# Core Collections
cp strapi-schemas/core-collections/*.json src/api/[collection-name]/content-types/[collection-name]/schema.json

# Configuration Collections
cp strapi-schemas/config-collections/*.json src/api/[collection-name]/content-types/[collection-name]/schema.json
```

### **Option 2: CLI Commands**
Use the Strapi CLI to generate collections:
```bash
# Generate all core collections
npm run strapi generate content-type tenant
npm run strapi generate content-type client
npm run strapi generate content-type appointment
npm run strapi generate content-type service
npm run strapi generate content-type form
npm run strapi generate content-type form-submission
npm run strapi generate content-type waitlist-entry
npm run strapi generate content-type consent-form
npm run strapi generate content-type signature
npm run strapi generate content-type financial-transaction
npm run strapi generate content-type sms-log
npm run strapi generate content-type email-log
npm run strapi generate content-type conversation

# Generate configuration collections
npm run strapi generate content-type service-category
npm run strapi generate content-type form-template
npm run strapi generate content-type theme
npm run strapi generate content-type business-setting
```

### **Option 3: Database Import**
1. Start Strapi with SQLite: `npm run develop`
2. Import schema files through Strapi admin
3. Run data seeding scripts (see `mock-data/` folder)

## 🏗️ Multi-Tenant Implementation

### **Data Isolation Strategy**
- Every core collection includes `tenant` relation (required)
- API middleware filters all queries by tenant ID
- File uploads organized by tenant in Supabase buckets

### **Subscription Management**
```javascript
// Tenant subscription fields
subscriptionTier: "basic" | "premium"
subscriptionStatus: "active" | "past_due" | "canceled" | "trialing"
stripeCustomerId: "cus_xxx"
stripeSubscriptionId: "sub_xxx"
```

### **Usage Tracking**
- SMS/Email logs track per-tenant usage
- Rate limiting enforced at API level
- Billing calculated from communication logs

## 🔧 Environment Variables Required

```env
# Database
DATABASE_URL=sqlite://./data.db

# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret

# Third-party Integrations (Phase 2)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

SENDGRID_API_KEY=your_sendgrid_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## 📊 Mock Data Structure

Each collection includes realistic mock data for development:
- **Tenants**: 3 different business types (tattoo, piercing, esthetics)
- **Clients**: 15+ diverse client profiles per tenant
- **Appointments**: Past, current, and future appointments
- **Services**: Categorized service offerings with realistic pricing
- **Forms**: Pre-built intake and consent forms
- **Transactions**: Realistic payment history and financial data

## 🎯 Next Steps

1. **Deploy Schemas**: Import all collections into Strapi
2. **Configure Permissions**: Set up API access controls
3. **Seed Data**: Import mock data for development
4. **Test Relationships**: Verify all foreign key constraints
5. **API Integration**: Connect React frontend to Strapi backend

---

*Generated for Phase 3 Implementation - Backend Integration*
*Total Collections: 16 | Relationships: 25+ | Multi-Tenant Ready: ✅*