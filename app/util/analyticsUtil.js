import { isdev } from '@config/index';
import mixpanel from 'mixpanel-browser';

/**
 * Initialize SDK
 */
export function initAnalytics() {
  // const firebaseConfig = {
  //   apiKey: 'AIzaSyCwE8kgWxe5US5dh1NPL7G3lK9ZKUMm084',
  //   authDomain: 'stafi-test.firebaseapp.com',
  //   projectId: 'stafi-test',
  //   storageBucket: 'stafi-test.appspot.com',
  //   messagingSenderId: '573832451781',
  //   appId: '1:573832451781:web:7f89f440bef1afd12f02ac',
  //   measurementId: 'G-VVY34BZ3BP',
  // };
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  mixpanel.init('698eea3dfe24d4d5c92e1f5ad0779c0f', { debug: isdev() });
}
