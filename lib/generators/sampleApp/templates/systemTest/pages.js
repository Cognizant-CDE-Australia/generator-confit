'use strict';

const assert = require('assert');

let I;

module.exports = {

  _init() {
    I = actor();
  },

  fields: {
    heading1: {css: 'h1'},
    heading2: {css: 'h2'},
    cssType: {css: '.css-type'},
    body: {css: 'body'},
    logo: {css: 'img'},
    linkToPage2: {css: 'a'},
    linkToPage1: {css: 'a'},
  },

  checkPage1Loaded() {
    I.waitForElement(this.fields.heading1);
  },

  checkPage2Loaded() {
    I.seeInCurrentUrl('page2');
    I.waitForElement(this.fields.heading2);
  },

  seeCSSValue: function* (selector, cssProp, expected, pseudoElem = null) {
    let actual = yield I.executeScript((sel, pseudo, cssProp) => {
      return window.getComputedStyle(document.querySelector(sel), pseudo)[cssProp];
    }, selector, pseudoElem, cssProp);

    if (expected === undefined) {
      return actual;
    }

    if (typeof expected === 'string') {
      assert.equal(actual, expected);
    } else {
      assert(actual.match(expected) !== null);
    }
  },

  goBack() {
    I.executeScript(function() {
      history.back();
    });
  }
};
