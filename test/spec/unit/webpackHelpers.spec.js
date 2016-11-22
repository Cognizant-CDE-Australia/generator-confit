'use strict';

const helpers = require('../../../lib/buildTool/webpack/buildBrowser/templates/webpackHelpers.js')('basePath/');
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
        prop4: '/path/to/[contentHash: blah blah][name].js',
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
        prop4: '/path/to/[contentHash: blah blah][name].js',
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

  describe('hasLoader()', () => {
    it('should return true when the loader can be found', () => {
      const rule = {
        use: [
          {
            loader: 'abc',
          },
        ],
      };
      assert.equal(helpers.hasLoader(rule, 'abc'), true);
    });

    it('should return false when the loader cannot be found due to missing "use" property', () => {
      const rule = {
        loaders: [
          {
            loader: 'abc',
          },
        ],
      };
      assert.equal(helpers.hasLoader(rule, 'abc'), false);
    });

    it('should return false when the loader cannot be found due to it not being in the list of loaders', () => {
      const rule = {
        loaders: [
          {
            loader: 'xyz',
          },
        ],
      };
      assert.equal(helpers.hasLoader(rule, 'abc'), false);
    });

    it('should return true when the loader is in the list of loaders', () => {
      const rule = {
        use: [
          {
            loader: 'xyz',
          },
          {
            loader: 'abc',
          },
        ],
      };
      assert.equal(helpers.hasLoader(rule, 'abc'), true);
    });
  });

  describe('findLoader()', () => {
    it('should return the loader that exists in the config', () => {
      const targetLoader = {
        test: /\.css$/,
        use: [
          {
            loader: 'xyz',
          },
          {
            loader: 'abc',
          },
        ],
      };
      const config = {
        module: {
          rules: [
            targetLoader,
          ],
        },
      };
      assert.equal(helpers.findLoader(config, 'abc'), targetLoader);

      // And if the loader doesn't exist, undefined is returned.
      assert.equal(helpers.findLoader(config, 'unknown'), undefined);
    });
  });


  describe('hasProcessFlag()', () => {
    it('should return true when the process has the flag', () => {
      // console.log(process.argv);
      assert.equal(helpers.hasProcessFlag('reporter'), true);
      assert.equal(helpers.hasProcessFlag('made-up-flag-that-should not exist'), false);
    });
  });

  describe('isWebpackDevServer()', () => {
    it('should return true when the process is running inside webpack-dev-server', () => {
      // console.log(process.argv[1]);
      assert.equal(helpers.isWebpackDevServer(), false);  // Running inside Mocha, so this should be false

      // Modify the argument for the sake of this test
      process.argv[1] = 'blah_webpack-dev-server/foo';
      assert.equal(helpers.isWebpackDevServer(), true);
    });
  });

  describe('root()', () => {
    it('should return a full path from the initialised root path', () => {
      assert.equal(helpers.root(), 'basePath/'); // <-- See the require statement at the top of this file
      assert.equal(helpers.root('abc'), 'basePath/abc');
      assert.equal(helpers.root('abc/', 'de/'), 'basePath/abc/de/');
      assert.equal(helpers.root('abc/', '../de/'), 'basePath/de/');
    });
  });
});
