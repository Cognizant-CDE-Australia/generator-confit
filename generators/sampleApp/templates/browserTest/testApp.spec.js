'use strict';

describe('Test SampleApp build', function() {

  var pages = require('./pages');
  var page1 = pages.Page1();
  var page2 = pages.Page2();

  it('should have a page 1 which has a non-white background-colour, a large image, a heading, and a link to the second page', function() {
    page1.get();
    expect(browser.getCurrentUrl()).toContain('page1');

    expect(page1.heading.getText()).toEqual('This is page 1');
    expect(page1.heading.getCssValue('color')).toEqual('rgba(40, 50, 60, 1)');

    expect(page1.logo.getAttribute('width')).toEqual('300');
    expect(page1.logo.getAttribute('height')).toEqual('250');

    // There should be a background colour
    expect(page1.body.getCssValue('background-color')).not.toEqual('rgba(0, 0, 0, 0)');

    expect(page1.linkToPage2.isDisplayed()).toEqual(true);

    // Goto page 2
    page1.linkToPage2.click();
    expect(browser.getCurrentUrl()).toContain('page2');
    expect(page2.heading.getText()).toEqual('This is page 2');

    // If the button width is 83px, it means that the icon font has been loaded
    page2.linkToPage1.getCssValue('width').then(function (value) {
      expect(parseInt(value, 10)).toBeGreaterThan(74);
    });



    // Go back to page 1
    page2.linkToPage1.click();
    expect(browser.getCurrentUrl()).toContain('page1');
    expect(page1.heading.getText()).toEqual('This is page 1');

    // Now verify that the history is working..
    browser.navigate().back();
    expect(browser.getCurrentUrl()).toContain('page2');
    expect(page2.heading.getText()).toEqual('This is page 2');

    browser.navigate().back();
    expect(browser.getCurrentUrl()).toContain('page1');
    expect(page1.heading.getText()).toEqual('This is page 1');
  });

});
