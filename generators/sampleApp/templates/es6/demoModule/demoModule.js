'use strict';

// Basic routing functions, in the absence of a "proper" router
function gotoPage(pageName, addToHistory) {
  // TODO: Use config paths here instead of 'modules/demoModule'
  document.getElementById('content').innerHTML = window[pageName];
  if (addToHistory !== false) {
    history.pushState({isPushState: true, url: pageName}, pageName, pageName);
  }
}

window.onpopstate = function(event) {
  if (event.state && event.state.isPushState) {
    gotoPage(event.state.url, false);
  }
};

export default {
  gotoPage: gotoPage
};


