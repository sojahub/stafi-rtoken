import { isdev } from '@config/index';
import mixpanel from 'mixpanel-browser';

/**
 * Initialize mixpanel SDK
 */
export function initAnalytics() {
  mixpanel.init('e408ada8d9849c0413b40e23751a3651', { debug: isdev() });
}
