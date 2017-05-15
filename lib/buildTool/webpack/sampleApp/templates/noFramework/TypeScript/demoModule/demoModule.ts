'use strict';

let win = window;
win.onpopstate = stateChangeHandler;

let demoModule = {
  gotoPage: gotoPage,
  setWindow: function(newWin) {   // Allow the window object to be mocked
    win = newWin;
    win.onpopstate = stateChangeHandler;
  }
};

// Basic routing functions, in the absence of a "proper" router
function gotoPage(pageName, addToHistory) {
  // TODO: Use config paths here instead of 'modules/demoModule'
  (<any>win).document.getElementById('content').innerHTML = win[pageName.replace('#/', '')];
  if (addToHistory !== false) {
    let title = pageName;
    let url = '#/' + pageName;
    win.history.pushState({ isPushState: true, url: url }, title, url);
  }
}

function stateChangeHandler(event) {
  if (event.state && event.state.isPushState) {
    demoModule.gotoPage(event.state.url, false);
  }
}

export default demoModule;
