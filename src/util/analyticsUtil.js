import mixpanel from 'mixpanel-browser';
import { isdev } from 'src/config/index';

/**
 * Initialize mixpanel SDK
 */
export function initAnalytics() {
  mixpanel.init('e408ada8d9849c0413b40e23751a3651', { debug: isdev() });
}
