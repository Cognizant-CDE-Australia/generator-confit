'use strict';

export default {
  gotoPage: function(pageName) {
    // TODO: Use config paths here instead of 'modules/demoModule'
    document.getElementById('content').innerHTML = window[pageName];
  }
};
