'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'buildBrowser';


describe('buildBrowser Generator', () => {
  it('should have a default browser support value', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'buildBrowser-config.json',
      utils.noop,
      function after() {
        yoassert.file(['confit.yml']);
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].buildBrowser;

        assert.equal(typeof config.browserSupport, 'object');
        assert(config.browserSupport[0].indexOf(' ') === -1, 'browserSupport is a simple key');
        assert(config.browserSupport.length > 0, 'browser support length is greater than 0');

        // Package.json is not even created
        yoassert.noFile(['package.json']);
        done();
      }
    );
  });
});
