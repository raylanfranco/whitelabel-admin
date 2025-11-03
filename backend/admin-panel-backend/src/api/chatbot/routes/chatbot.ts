/**
 * chatbot router
 * Custom routes for chatbot lead capture
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/chatbot/leads',
      handler: 'chatbot.captureLead',
      config: {
        auth: false, // Public endpoint for chatbot widget
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/chatbot/leads',
      handler: 'chatbot.getLeads',
      config: {
        auth: false, // Public endpoint for dashboard
        policies: [],
        middlewares: [],
      },
    },
  ],
};


