/**
 * client controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::client.client', ({ strapi }) => ({
  // Mark a lead as viewed
  async markViewed(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest('Client ID is required');
      }

      // Update the client with current timestamp
      const updatedClient = await strapi.entityService.update('api::client.client', id, {
        data: {
          leadViewedAt: new Date(),
        },
      });

      ctx.send({
        success: true,
        client: updatedClient,
      });
    } catch (error) {
      console.error('Error marking lead as viewed:', error);
      ctx.internalServerError('Failed to mark lead as viewed', { error: error.message });
    }
  },
}));
