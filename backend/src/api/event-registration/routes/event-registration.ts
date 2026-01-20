/**
 * event-registration routes
 */
import { factories } from '@strapi/strapi';

const EVENT_REGISTRATION = 'api::event-registration.event-registration' as any;

export default factories.createCoreRouter(EVENT_REGISTRATION);
