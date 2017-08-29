'use strict';

const assert = require('assert');

Feature('Sample App');

Scenario('should type', function* (I, app) {
  I.amOnPage('/');
  app.checkPage1Loaded();

  I.see('This is page 1', app.fields.heading1);
  yield* app.seeCSSValue(app.fields.heading1.css, 'color', 'rgb(40, 50, 60)');

  let width = yield I.grabAttributeFrom(app.fields.logo, 'width');
  assert.equal(width, '454');

  let height = yield I.grabAttributeFrom(app.fields.logo, 'height');
  assert.equal(height, '406');

  // There should be a cssType, which is a pseudo element containing text
  yield* app.seeCSSValue(app.fields.cssType.css, 'content', /CSS Preprocessor */, ':after');

  I.see('Page 2', app.fields.linkToPage2);

  // Goto page 2
  I.click(app.fields.linkToPage2);
  app.checkPage2Loaded();

  I.see('This is page 2', app.fields.heading2);
  let btnWidth = yield* app.seeCSSValue(app.fields.linkToPage1.css, 'width');
  assert(parseInt(btnWidth, 10) > 74, 'Button width is greater than 74');

  // Go back to page 1
  I.click(app.fields.linkToPage1);
  I.seeInCurrentUrl('page1');
  I.see('This is page 1', app.fields.heading1);
  I.dontSee('This is page 2');

  // Now verify that the history is working..
  app.goBack();
  I.seeInCurrentUrl('page2');
  I.dontSee('This is page 1');
  I.see('This is page 2', app.fields.heading2);


  app.goBack();
  I.see('This is page 1', app.fields.heading1);
  I.dontSee('This is page 2');
});
