/**
 * notification-template controller
 */
import { factories } from '@strapi/strapi';

const NOTIFICATION_TEMPLATE = 'api::notification-template.notification-template' as any;

export default factories.createCoreController(NOTIFICATION_TEMPLATE);
