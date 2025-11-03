# Victory Rush Chatbot Widget 🤖

A beautiful, lightweight chatbot widget that captures leads and integrates seamlessly with any website.

## Features

- ✅ **Zero Dependencies** - Pure vanilla JavaScript
- ✅ **Lightweight** - Less than 15KB
- ✅ **Responsive** - Works on all devices
- ✅ **Easy Integration** - Just one script tag
- ✅ **Customizable** - Colors, position, messages
- ✅ **Conversational Flow** - Natural, engaging interaction
- ✅ **Strapi Integration** - Automatically sends leads to your admin panel

## Quick Start

### 1. Add to Any HTML Page

Add this script tag before the closing `</body>` tag:

```html
<script src="http://localhost:5173/chatbot-widget.js"></script>
```

That's it! The chatbot will appear in the bottom-right corner.

### 2. Customize (Optional)

Add customization after the script tag:

```html
<script src="http://localhost:5173/chatbot-widget.js"></script>
<script>
  VRChatbot.config({
    companyName: "Your Company Name",
    primaryColor: "#10B981",
    secondaryColor: "#059669",
    greeting: "Hi! 👋 How can we help you today?",
    position: "bottom-right"  // or "bottom-left"
  });
</script>
```

## How It Works

1. **Visitor Interaction**: User clicks the chatbot button
2. **Conversational Flow**: Bot asks for:
   - First Name
   - Last Name
   - Email
   - Phone
   - Message/Needs
3. **Lead Capture**: Data is sent to `http://localhost:1337/api/chatbot/leads`
4. **Admin Notification**: Lead appears in your admin panel instantly with 🔥 indicator

## Installation for Your Pest Control Template

### For the HTML Template in `pest--control` folder:

1. Open your `index.html` file
2. Find the closing `</body>` tag (usually at the bottom)
3. Add this right before it:

```html
<!-- Victory Rush Chatbot Widget -->
<script src="http://localhost:5173/chatbot-widget.js"></script>
<script>
  VRChatbot.config({
    companyName: "Bob's Pest Control",
    primaryColor: "#10B981",
    secondaryColor: "#059669",
    greeting: "Hi! 👋 Need help with pest control?",
    position: "bottom-right"
  });
</script>
</body>
```

## Demo

Visit the demo page to see it in action:
```
http://localhost:5173/chatbot-demo.html
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `companyName` | string | "Bob's Pest Control" | Your company name |
| `primaryColor` | string | "#10B981" | Primary brand color (hex) |
| `secondaryColor` | string | "#059669" | Secondary brand color (hex) |
| `greeting` | string | "Hi! 👋 Need help..." | Initial greeting message |
| `position` | string | "bottom-right" | Widget position ("bottom-right" or "bottom-left") |
| `apiEndpoint` | string | "http://localhost:1337/api/chatbot/leads" | Strapi endpoint |

## Production Deployment

For production, you'll need to:

1. **Update API Endpoint**: Change from `localhost:1337` to your production Strapi URL
2. **Host the Widget**: Upload `chatbot-widget.js` to your CDN or web server
3. **Update Script Source**: Change the script src to your hosted URL

Example for production:

```html
<script src="https://yourdomain.com/chatbot-widget.js"></script>
<script>
  VRChatbot.config({
    apiEndpoint: "https://api.yourdomain.com/api/chatbot/leads",
    companyName: "Your Company",
    primaryColor: "#your-color"
  });
</script>
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## What Happens to Leads?

When someone submits the chatbot form:

1. **Creates Client in Strapi** with `referralSource: "website"`
2. **Appears in Admin Panel** Client List with green highlight and 🔥 indicator
3. **Shows in Dashboard** "Chatbot Leads" counter (last 24 hours)
4. **Real-time Updates** Admin panel polls every 30 seconds

## Customization Examples

### Match Your Brand Colors
```javascript
VRChatbot.config({
  primaryColor: "#FF6B6B",    // Coral red
  secondaryColor: "#EE5A6F",  // Darker coral
  companyName: "Red Pest Control"
});
```

### Position on Left Side
```javascript
VRChatbot.config({
  position: "bottom-left"
});
```

### Custom Greeting
```javascript
VRChatbot.config({
  greeting: "Welcome! 🐛 Got bugs? Let's chat!"
});
```

## Troubleshooting

### Widget doesn't appear
- Check browser console for errors
- Ensure Strapi backend is running on `localhost:1337`
- Verify script path is correct

### Leads not showing in admin
- Check Strapi is running: `npm run develop` in backend folder
- Verify API endpoint is correct
- Check browser Network tab for failed requests

### Styling conflicts
The widget uses isolated CSS with the `#vr-chatbot-` prefix to avoid conflicts with your site's styles.

## Support

For issues or questions, check the admin panel backend logs or browser console for error messages.

---

Made with ❤️ for Victory Rush SaaS
