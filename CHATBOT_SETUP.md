# 🤖 Victory Rush AI Chatbot - Setup Guide

## Overview
This is the **$5k product** that justifies Phase 2 pricing ($2,497 setup). The chatbot handles:
- ✅ 24/7 lead capture (Name, Phone, Email, Service, Zip)
- ✅ FAQ handling (cost, licensing, areas, availability)
- ✅ Booking flow (shows available slots)
- ✅ Real-time lead appearance in admin panel

## Demo Flow (60 seconds)
1. Click chat bubble → smooth open animation
2. Bot: "Hi! Looking for [industry]? I can get you a quote in 30 seconds."
3. User: "Yes" → Bot collects info conversationally
4. Bot: "Perfect! [Business] will text you within 15 minutes. Expect a call from [phone]."
5. Lead appears **LIVE** in admin panel during demo
6. Client reaction: **"Holy shit, when can we start?"**

## Quick Start

### 1. Demo the Chatbot Locally

```bash
# Start the frontend
npm run dev

# Visit: http://localhost:5173/chatbot-demo
```

This shows the full demo page with configurable business settings.

### 2. Start the Backend (Strapi)

```bash
cd backend/admin-panel-backend
npm run develop

# API will be at: http://localhost:1337/api
```

### 3. Test Lead Capture

1. Open `/chatbot-demo`
2. Click the chat bubble
3. Say "Yes" when asked about a quote
4. Fill in: Name, Phone, Email, Service, Zip
5. Lead should appear in admin panel at `/clients`

## Embedding on Client Websites

### Option 1: React Component (For React Sites)

```jsx
import ChatbotWidget from './components/ChatbotWidget';

<ChatbotWidget
  tenantId="tenant-123"
  businessName="ABC Pest Control"
  businessPhone="(555) 123-4567"
  industry="pest control"
  apiUrl="https://api.yourdomain.com"
/>
```

### Option 2: Standalone Embed Script (For Any Website)

Add to any HTML page:

```html
<!-- Load the chatbot script -->
<script src="https://cdn.yourdomain.com/chatbot-widget.js"></script>

<!-- Initialize -->
<script>
  window.VictoryRushChatbot.init({
    tenantId: 'tenant-123',
    businessName: 'ABC Pest Control',
    businessPhone: '(555) 123-4567',
    industry: 'pest control',
    apiUrl: 'https://api.yourdomain.com'
  });
</script>
```

### Option 3: Build Standalone Bundle

```bash
# Create a build that works on any site
npm run build:chatbot

# Output: dist/chatbot-widget.js
# Upload to CDN and embed on client sites
```

## API Endpoints

### POST `/api/chatbot/leads`
Capture a new lead from the chatbot.

**Request:**
```json
{
  "tenantId": "tenant-123",
  "name": "John Doe",
  "phone": "(555) 123-4567",
  "email": "john@example.com",
  "service": "Pest Control Service",
  "zipCode": "12345",
  "source": "chatbot",
  "timestamp": "2024-03-20T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "clientId": 123,
  "message": "Lead captured successfully"
}
```

### GET `/api/chatbot/leads/:tenantId`
Get recent chatbot leads for a tenant.

## Features

### Visual Requirements (Justifies $2,497)
- ✅ Smooth slide-in animation (0.3s ease-out)
- ✅ Professional color scheme (auto-adapts to template)
- ✅ Typing indicators ("..." while thinking)
- ✅ Clean, modern UI (not generic chatbot look)
- ✅ Mobile-responsive (60% of traffic is mobile)
- ✅ Fast response time (<2 seconds)

### Conversation Features
- **Lead Capture Flow**: Collects Name → Phone → Email → Service → Zip
- **FAQ Handling**: Answers common questions about cost, licensing, areas, availability
- **Industry-Specific**: Greetings and responses adapt to industry type
- **Natural Conversation**: Decision tree logic with conversational flow

### Admin Panel Integration
- Leads appear in ClientList component
- Marked with `referralSource: 'website'`
- Includes notes: "Chatbot lead - Service: X, Zip: Y"
- Creates conversation thread automatically

## Configuration

### Industry Types
- `pest control`
- `hvac`
- `plumbing`
- `electrical`
- `landscaping`

### Auto-Color Detection
The widget automatically detects page colors:
1. Checks for `--primary-color` CSS variable
2. Falls back to first `<a>` or `<button>` color
3. Defaults to `#3B82F6` (blue)

## Demo Script for Zoom Calls

**Minutes 6-10: Show The Backend (MRR Upsell)**

1. Pull up whitelabel admin panel
2. Open the chatbot demo page in another tab
3. Start a conversation: "Yes" → fill in lead info
4. **Show lead appearing LIVE** in admin panel
5. Say: "Most of our clients add this for $99/mo - it handles booking, FAQs, lead capture 24/7"

**Key Demo Points:**
- Smooth animations (looks premium)
- Fast response time (<2 seconds)
- Auto-adapts to their website colors
- Leads appear instantly in their dashboard
- Works 24/7 - never miss a lead

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ to Vercel
```

### Backend (Strapi)
```bash
cd backend/admin-panel-backend
npm run build
npm run start
# Deploy to Railway/Render/Heroku
```

### CDN for Embed Script
1. Build standalone chatbot bundle
2. Upload to Cloudflare/CloudFront
3. Clients embed from CDN URL

## Troubleshooting

### Chatbot not appearing?
- Check browser console for errors
- Verify `tenantId` is set correctly
- Ensure API URL is accessible (CORS enabled)

### Leads not appearing in admin panel?
- Check Strapi backend is running
- Verify API endpoint: `POST /api/chatbot/leads`
- Check network tab for API errors

### Colors not matching template?
- Widget auto-detects colors, but you can override:
```jsx
<ChatbotWidget
  primaryColor="#FF5733" // Override auto-detection
  // ... other props
/>
```

## Next Steps

1. ✅ **Today**: Test locally, refine animations
2. ✅ **Tomorrow**: Build standalone embed script
3. ✅ **Demo**: Practice the 60-second flow 10x
4. ✅ **Deploy**: Production-ready for Zoom calls

## The Goal

**"Holy shit, when can we start?"** - That's the reaction you want.

This chatbot justifies $2,497 setup because it:
- Captures leads 24/7 (never miss a customer)
- Looks premium (not an MVP)
- Works instantly (no configuration)
- Shows results immediately (leads appear live)

You're not selling a chatbot. You're selling a **money-printing machine**.


