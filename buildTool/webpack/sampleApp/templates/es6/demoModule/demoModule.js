'use strict';

// Basic routing functions, in the absence of a "proper" router
function gotoPage(pageName, addToHistory) {
  // TODO: Use config paths here instead of 'modules/demoModule'
  window.document.getElementById('content').innerHTML = window[pageName.replace('#/', '')];
  if (addToHistory !== false) {
    var title = pageName;
    var url = '#/' + pageName;
    window.history.pushState({ isPushState: true, url: url }, title, url);
  }
}

window.onpopstate = function (event) {
  if (event.state && event.state.isPushState) {
    gotoPage(event.state.url, false);
  }
};

export default {
  gotoPage: gotoPage
};


