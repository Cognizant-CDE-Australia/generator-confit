'use strict';

function page1() {
  var page = {
    get: function() {
      browser.get('/');
      browser.wait(protractor.until.elementLocated(by.css('h1')));
    },

    body: element(by.css('body')),
    heading: element(by.css('h1')),
    logo: element(by.css('img')),
    linkToPage2: element(by.css('a')),
    cssType: function() {
      // To get the content of a pseudo element, you need to do this:
      var selector = '.css-type';
      return browser.executeScript('return window.getComputedStyle(document.querySelector("' + selector + '"), ":after").content.replace(/"/g, "")');
    }
  };
  return page;
}


function page2() {
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
  Page1: page1,
  Page2: page2
};
