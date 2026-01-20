/**
 * notification-log controller
 */
import { factories } from '@strapi/strapi';

const NOTIFICATION_LOG = 'api::notification-log.notification-log' as any;

export default factories.createCoreController(NOTIFICATION_LOG);
