/**
 * client router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'PUT',
      path: '/clients/:id/mark-viewed',
      handler: 'client.markViewed',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/clients',
      handler: 'client.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/clients/:id',
      handler: 'client.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
