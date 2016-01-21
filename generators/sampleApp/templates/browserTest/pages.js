'use strict';

var Page1 = function() {
  var page = {
    get: function() {
      browser.get('/');
      browser.wait(protractor.until.elementLocated(by.css('h1')));
    },

    body: element(by.css('body')),
    heading: element(by.css('h1')),
    logo: element(by.css('img')),
    linkToPage2: element(by.css('a'))
  };
  return page;
};


var Page2 = function() {
  var page = {
    get: function() {
      browser.get('/page2');
      browser.wait(protractor.until.elementLocated(by.css('h2')));
    },

    body: element(by.css('body')),
    heading: element(by.css('h2')),
    linkToPage1: element(by.css('a'))
  };
  return page;
};



module.exports = {
  Page1: Page1,
  Page2: Page2
};
