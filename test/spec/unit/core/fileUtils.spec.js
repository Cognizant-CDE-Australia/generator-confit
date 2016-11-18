'use strict';

const fileUtils = require('../../../../lib/core/fileUtils.js');
const path = require('path');
const assert = require('assert');

describe('fileUtils', () => {

  describe('validatePath()', () => {
    it('should return true when a path is valid, or an error message if not', () => {
      const tests = [
        {path: 'path/', expected: true, desc: 'valid path'},
        {path: '', expected: 'Path must not be blank', desc: 'blank path'},
        {path: `.${path.sep}foo`, expected: `Path must not start with ".${path.sep}"`, desc: 'starts with ./'},
        {path: `path_anything..${path.sep}bar`, expected: `Path must not contain "..${path.sep}"`, desc: 'starts with ../'},
        {path: '/abs/path', expected: `Absolute paths are not permitted`, desc: 'absolute path'},
        {path: 'path/path2', expected: true, desc: 'valid path'},
      ];

      tests.forEach(test => assert.equal(fileUtils.validatePath(test.path), test.expected, test.desc));
    });
  });
});
