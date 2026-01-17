/**
 * notification-template service
 */
import { factories } from '@strapi/strapi';

const NOTIFICATION_TEMPLATE = 'api::notification-template.notification-template' as any;

export default factories.createCoreService(NOTIFICATION_TEMPLATE);
