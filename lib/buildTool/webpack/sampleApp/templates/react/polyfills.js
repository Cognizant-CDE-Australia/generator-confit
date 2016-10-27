import promiseLibRejectionTracking from 'promise/lib/rejection-tracking';
import promiseExtensions from 'promise/lib/es6-extensions';
import objectAssignPolyfill from 'object-assign';
import 'whatwg-fetch';


if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  promiseLibRejectionTracking.enable();
  window.Promise = promiseExtensions;
}

// fetch() polyfill for making API calls.
// require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = objectAssignPolyfill;
