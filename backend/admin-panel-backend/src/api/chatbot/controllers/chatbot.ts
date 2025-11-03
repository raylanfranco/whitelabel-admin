/**
 * chatbot controller
 * Handles lead capture from chatbot widget
 */

export default {
  async captureLead(ctx) {
    try {
      const { name, phone, email, service, zipCode, source, timestamp } = ctx.request.body;

      // Validate required fields
      if (!name || !phone) {
        return ctx.badRequest('Missing required fields: name, phone');
      }

      // Create or update client
      const clientData = {
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        phone: phone,
        email: email || `${phone.replace(/\D/g, '')}@chatbot.lead`,
        referralSource: 'website', // Chatbot leads come from website
        notes: `Chatbot lead - Service: ${service || 'Not specified'}, Zip: ${zipCode || 'Not specified'}, Captured: ${timestamp || new Date().toISOString()}`,
        clientStatus: 'active' as const,
      };

      // Check if client already exists by phone
      const existingClients = await strapi.entityService.findMany('api::client.client', {
        filters: {
          phone: phone,
        },
      });

      let client;
      if (existingClients.length > 0) {
        // Update existing client
        client = await strapi.entityService.update('api::client.client', existingClients[0].id, {
          data: {
            ...clientData,
            notes: `${existingClients[0].notes || ''}\n\n[${new Date().toLocaleString()}] New chatbot inquiry: ${service || 'General inquiry'}`,
          },
        });
      } else {
        // Create new client
        client = await strapi.entityService.create('api::client.client', {
          data: clientData,
        });
      }

      // Create a conversation/message for this lead
      try {
        const conversation = await strapi.entityService.create('api::conversation.conversation', {
          data: {
            client: client.id,
            lastMessageTime: new Date(),
          },
        });

        await strapi.entityService.create('api::message.message', {
          data: {
            conversation: conversation.id,
            text: `New chatbot lead: ${service || 'General inquiry'} - Zip: ${zipCode || 'N/A'}`,
            sender: 'system',
            timestamp: new Date(),
          },
        });
      } catch (convError) {
        // Conversation creation is optional - log but don't fail
        console.warn('Could not create conversation for chatbot lead:', convError);
      }

      // Return success
      ctx.send({
        success: true,
        clientId: client.id,
        message: 'Lead captured successfully',
      });
    } catch (error) {
      console.error('Chatbot lead capture error:', error);
      ctx.internalServerError('Failed to capture lead', { error: error.message });
    }
  },

  async getLeads(ctx) {
    try {
      // Get recent clients from chatbot
      const clients = await strapi.entityService.findMany('api::client.client', {
        filters: {
          referralSource: 'website',
        },
        sort: { createdAt: 'desc' },
        limit: 50,
      });

      ctx.send({
        success: true,
        leads: clients,
        count: clients.length,
      });
    } catch (error) {
      console.error('Chatbot get leads error:', error);
      ctx.internalServerError('Failed to fetch leads', { error: error.message });
    }
  },
};

