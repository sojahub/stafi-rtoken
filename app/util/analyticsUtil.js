import { isdev } from '@config/index';
import mixpanel from 'mixpanel-browser';

/**
 * Initialize mixpanel SDK
 */
export function initAnalytics() {
  mixpanel.init('698eea3dfe24d4d5c92e1f5ad0779c0f', { debug: isdev() });
}
