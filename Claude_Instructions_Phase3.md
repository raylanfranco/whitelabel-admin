# 🧠 Claude Instructions: Victory Rush SaaS Admin Phase 2

You are assisting with Phase 2 of an advanced SaaS Admin Panel built for tattoo artists and estheticians. The frontend is already built in React with modular components. Your task is to execute the backend integrations and CMS setup using Strapi, Supabase, Stripe, and Twilio.

## 🔌 PRIORITY INTEGRATIONS

### 1. Strapi CMS Configuration (HIGH PRIORITY)
Generate complete backend schemas in Strapi including:
- ✅ Collection Types with fields and relationships
- ✅ Multi-tenant data separation using `tenantId`
- ✅ API permissions and roles
- ✅ Component-based structuring if needed
- ✅ CLI-compatible or schema.json format
- ✅ Optional mock data seeding

#### 📦 Core Collections
- `Tenants`
- `Clients` → belongs to `Tenant`
- `Appointments` → belongs to `Client`, `Service`, `Tenant`
- `Services` → belongs to `Tenant`, optional `ServiceCategory`
- `Forms` → linked to `Clients` and `Submissions`
- `WaitlistEntries`
- `ConsentForms` and `Signatures`
- `FinancialTransactions`
- `SMSLogs`, `EmailLogs`

#### 🛠️ Configuration Collections
- `Themes`
- `BusinessSettings`
- `ServiceCategories`
- `FormTemplates`

#### 🧩 Relationships
- All entities must reference a `tenantId` field
- Clients → Appointments (1:N)
- Appointments → Services (M:N optional)
- Submissions → Forms (1:N)
- Signatures → ConsentForms (1:N)
- Transactions → Clients (1:N)
- Logs → Tenants (1:N)

#### 🧪 Optional:
- Export as `schema.json` or ready-to-paste folders for `/api/*`
- Provide CLI commands for creating each collection
- Include mock data seeding scripts via REST calls

---

### 2. Twilio Integration
- Use `.env` variables:
  ```env
  TWILIO_ACCOUNT_SID=
  TWILIO_AUTH_TOKEN=
  TWILIO_PHONE_NUMBER=
  ```
- Create webhook endpoints:
  - `POST /webhooks/sms-status/{tenantId}`
  - `POST /webhooks/sms-incoming/{tenantId}`
- Connect webhook responses to Strapi’s `SMSLogs` collection

---

### 3. Stripe Integration
- Finish PaymentForm logic
- Implement Stripe Connect for platform-based billing
- Setup SaaS subscriptions ($250/month and $500/month)
- Webhooks:
  - `subscription_created`
  - `invoice_paid`
  - `customer_updated`
  - `dispute_created`
- Sync webhook data to Strapi `Transactions`

---

### 4. Supabase Storage Integration
- Buckets per tenant:
  - `logos/`, `backgrounds/`, `signatures/`, `uploads/`
- Use `.env`:
  ```env
  SUPABASE_URL=
  SUPABASE_SERVICE_KEY=
  ```
- Expose endpoints or utility for file upload/download

---

### 5. Optional Email Integration (SendGrid)
- Use `.env`:
  ```env
  SENDGRID_API_KEY=
  ```
- Generate templates for:
  - Appointment confirmations
  - Payment receipts
  - Form deliveries

---

## 🧠 Final Notes
- Use SQLite for dev
- Include mock tenant + client data for demonstration
- Assume system will run behind Docker in production