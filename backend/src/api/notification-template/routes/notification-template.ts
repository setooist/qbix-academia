/**
 * notification-template routes
 */
import { factories } from '@strapi/strapi';

const NOTIFICATION_TEMPLATE = 'api::notification-template.notification-template' as any;

export default factories.createCoreRouter(NOTIFICATION_TEMPLATE);
