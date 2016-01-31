'use strict';
import React from 'react';

// Basic routing functions, in the absence of a "proper" router
function gotoPage(pages, renderer, pageName, addToHistory) {
  // TODO: Use config paths here instead of 'modules/demoModule'
  let Page = pages[pageName.replace('#/', '')];

  renderer(
    <Page gotoPage={gotoPage.bind(null, pages, renderer)} />,
    document.getElementById('content')
  );

  if (addToHistory !== false) {
    let title = pageName;
    let url = '#/' + pageName;
    window.history.pushState({ isPushState: true, url: url }, title, url);
  }
}

window.onpopstate = function (event) {
  if (event.state && event.state.isPushState) {
    gotoPage(event.state.url, false);
  }
};

export default {
  init(pages, renderer) {
    return {
      gotoPage: gotoPage.bind(null, pages, renderer)
    };
  }
};
