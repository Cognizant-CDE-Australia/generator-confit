// Environment-specific config

import {enableProdMode} from 'angular2/core';
import {ELEMENT_PROBE_PROVIDERS, ELEMENT_PROBE_PROVIDERS_PROD_MODE} from 'angular2/platform/browser';

// Environment Providers
let PROVIDERS = [];

if (__PROD__) {
  // Production
  enableProdMode();

  PROVIDERS = [
    ...PROVIDERS,
    ELEMENT_PROBE_PROVIDERS_PROD_MODE
  ];

} else {
  // Development
  PROVIDERS = [
    ...PROVIDERS,
    ELEMENT_PROBE_PROVIDERS
  ];

}

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
