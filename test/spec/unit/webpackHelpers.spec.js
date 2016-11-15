'use strict';

const helpers = require('../../../lib/buildTool/webpack/buildBrowser/templates/webpackHelpers.js')('../../');
const path = require('path');
const assert = require('assert');

let originalSepValue = path.sep;

describe('Webpack Helpers', () => {
  afterEach(() => {
    path.sep = originalSepValue;
  });

  describe('pathRegex()', () => {
    it('should convert a regular expression written in Unix/OSX format into a platform specific format', () => {
      path.sep = '_'; // Can use any separator, but in practice, the path.sep separator will be used
      let actual = helpers.pathRegEx(/a\/b/);

      assert.strictEqual(actual.source, /a_b/.source);
      assert.strictEqual(actual.toString(), '/a_b/');
    });

    it('should leave unchanged a RegEx written in Unix/OSX format when the platform is also Unix/OSX', () => {
      path.sep = '/';
      let actual = helpers.pathRegEx(/a\/b/);

      assert.strictEqual(actual.source, /a\/b/.source);
      assert.strictEqual(actual.test('z/x/a/b'), true);
      assert.strictEqual(actual.test('c:\\z\\x\\a\\b'), false);
    });

    it('should convert a RegEx written in Unix/OSX format when the platform is Windows', () => {
      path.sep = '\\';
      let actual = helpers.pathRegEx(/a\/b/);

      assert.strictEqual(actual.source, /a\\b/.source);
      assert.strictEqual(actual.test('z/x/a/b'), false);
      assert.strictEqual(actual.test('c:\\z\\x\\a\\b'), true);
    });

    it('should return a string if the argument is a string', () => {
      // If the regexp is already a string, it should return a string back
      path.sep = '\\';
      let actual = helpers.pathRegEx('modules/(.*)/assets/font/.*');

      assert.strictEqual(actual, 'modules\\\\(.*)\\\\assets\\\\font\\\\.*');
    });
  });

  describe('removeHash()', () => {
    it('should remove [hash] and [contentHash] blocks on a string', () => {
      let obj = {
        prop: '/path/to/[id].[hash].js',
        prop2: '/path/to/[id].[hash:blah].js',
        prop3: '/path/to/[id].[contentHash].js',
        prop4: '/path/to/[contentHash: blah blah][name].js'
      };

      helpers.removeHash(obj, 'prop');
      assert.strictEqual(obj.prop, '/path/to/[id]..js');

      helpers.removeHash(obj, 'prop2');
      assert.strictEqual(obj.prop2, '/path/to/[id]..js');

      helpers.removeHash(obj, 'prop3');
      assert.strictEqual(obj.prop3, '/path/to/[id]..js');

      helpers.removeHash(obj, 'prop4');
      assert.strictEqual(obj.prop4, '/path/to/[name].js');
    });

    it('should remove anything on a string', () => {
      let obj = {
        prop: '/path/to/[id].[hash].js',
        prop2: '/path/to/[id].[hash:blah].js',
        prop3: '/path/to/[id].[contentHash].js',
        prop4: '/path/to/[contentHash: blah blah][name].js'
      };

      helpers.removeHash(obj, 'prop', /\.\[hash\]/);
      assert.strictEqual(obj.prop, '/path/to/[id].js');

      helpers.removeHash(obj, 'prop2', /\.\[hash.*?\]/);
      assert.strictEqual(obj.prop2, '/path/to/[id].js');

      helpers.removeHash(obj, 'prop3', /\.\[contentHash\]/);
      assert.strictEqual(obj.prop3, '/path/to/[id].js');

      helpers.removeHash(obj, 'prop4', /\[contentHash.*?\]/);
      assert.strictEqual(obj.prop4, '/path/to/[name].js');
    });
  });
});
