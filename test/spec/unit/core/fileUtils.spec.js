'use strict';

const fileUtils = require('../../../../lib/core/fileUtils.js');
const renderEJS = require('../../../../lib/core/utils.js').renderEJS;
const path = require('path');
const assert = require('assert');

describe('fileUtils', () => {
  describe('validatePath()', () => {
    const tests = [
      {path: 'path/', expected: true, desc: 'is a valid path'},
      {path: '', expected: 'Path must not be blank', desc: 'is blank'},
      {path: `.${path.sep}foo`, expected: `Path must not start with ".${path.sep}"`, desc: 'starts with ./'},
      {path: `path_anything..${path.sep}bar`, expected: `Path must not contain "..${path.sep}"`, desc: 'starts with ../'},
      {path: '/abs/path', expected: `Absolute paths are not permitted`, desc: 'is absolute'},
      {path: 'path/path2', expected: true, desc: 'is a valid path with a sub path'},
    ];

    tests.forEach((test) => {
      it(`should return '${test.expected}' when the path ${test.desc}`, () => {
        assert.equal(fileUtils.validatePath(test.path), test.expected, test.desc);
      });
    });
  });


  describe('updateJSFile()', () => {
    let mockReadFile;
    let mockWriteFile;
    let mockOutputData;
    let mockThis;

    const SINGLE_FRAGMENT_TEMPLATE = `Top
// START_CONFIT_GENERATED_CONTENT
      Alpha <%- templateValue %>
// END_CONFIT_GENERATED_CONTENT
      Fin`;

    const MULTIPLE_FRAGMENT_TEMPLATE = `Top
// START_CONFIT_GENERATED_CONTENT
      Alpha <%- templateValue %>
// END_CONFIT_GENERATED_CONTENT
Bar
// START_CONFIT_GENERATED_CONTENT
      Zulu
// END_CONFIT_GENERATED_CONTENT
      Fin`;

    const FILE_TO_UPDATE_SINGLE_FRAGMENT = `My Top
// START_CONFIT_GENERATED_CONTENT
      Alpha Charlie
      (Modified)
// END_CONFIT_GENERATED_CONTENT
      My Fin`;

    const FILE_TO_UPDATE_MULTIPLE_FRAGMENT = `My Top
// START_CONFIT_GENERATED_CONTENT
Fragment 1
// END_CONFIT_GENERATED_CONTENT
Foo
// START_CONFIT_GENERATED_CONTENT
Fragment 2
// END_CONFIT_GENERATED_CONTENT
      My Fin`;

    beforeEach(() => {
      mockReadFile = [];
      mockWriteFile = '';
      mockOutputData = '';
      mockThis = {
        fs: {
          read: (param) => {
            mockReadFile.push(param);
            return param;
          },
          write: (outFile, output) => {
            mockWriteFile = outFile;
            mockOutputData = output;
          },
        },
        renderEJS: renderEJS,
      };
    });

    it('should create a JS file if a file does not exist and parse the template value', () => {
      mockThis.fs.exists = () => false;
      mockThis.fs.read = () => SINGLE_FRAGMENT_TEMPLATE;
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateJSFile.call(mockThis, 'readFile.js.tpl', 'destFile.js', templateData);

      assert.equal(mockWriteFile, 'destFile.js');
      assert.equal(mockOutputData, `Top
// START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
// END_CONFIT_GENERATED_CONTENT
      Fin`);
    });


    it('should update a JS file when the file exists, modifying just the template fragment', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_SINGLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateJSFile.call(mockThis, 'readFile.js.tpl', 'destFile.js', templateData);

      assert.equal(mockWriteFile, 'destFile.js');
      assert.equal(mockOutputData, `My Top
// START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
// END_CONFIT_GENERATED_CONTENT
      My Fin`);
    });

    it('should not update a JS file when the file exists but does not contain any fragments', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return 'foo bar'; // existing file does not have any fragments inside it
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateJSFile.call(mockThis, 'readFile.js.tpl', 'destFile.js', templateData);

      assert.equal(mockWriteFile, 'destFile.js');
      assert.equal(mockOutputData, `foo bar`);
    });

    it('should replace all the fragments in a JS file when the file exists, removing dest-file fragements which don\'t have a corresponding template fragment', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_MULTIPLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateJSFile.call(mockThis, 'readFile.js.tpl', 'destFile.js', templateData);

      assert.equal(mockWriteFile, 'destFile.js');
      assert.equal(mockOutputData, `My Top
// START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
// END_CONFIT_GENERATED_CONTENT
Foo
      My Fin`);
    });

    it('should replace all the fragments in a JS file when the file exists, adding template fragments when the dest-file has less fragments', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return MULTIPLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_SINGLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateJSFile.call(mockThis, 'readFile.js.tpl', 'destFile.js', templateData);

      assert.equal(mockWriteFile, 'destFile.js');
      assert.equal(mockOutputData, `My Top
// START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
// END_CONFIT_GENERATED_CONTENT

// START_CONFIT_GENERATED_CONTENT
      Zulu
// END_CONFIT_GENERATED_CONTENT
      My Fin`);
    });
  });

  describe('updateYAMLFile()', () => {
    let mockReadFile;
    let mockWriteFile;
    let mockOutputData;
    let mockThis;

    const SINGLE_FRAGMENT_TEMPLATE = `Top
# START_CONFIT_GENERATED_CONTENT
      Alpha <%- templateValue %>
# END_CONFIT_GENERATED_CONTENT
      Fin`;

    const MULTIPLE_FRAGMENT_TEMPLATE = `Top
# START_CONFIT_GENERATED_CONTENT
      Alpha <%- templateValue %>
# END_CONFIT_GENERATED_CONTENT
Bar
# START_CONFIT_GENERATED_CONTENT
      Zulu
# END_CONFIT_GENERATED_CONTENT
      Fin`;

    const FILE_TO_UPDATE_SINGLE_FRAGMENT = `My Top
# START_CONFIT_GENERATED_CONTENT
      Alpha Charlie
      (Modified)
# END_CONFIT_GENERATED_CONTENT
      My Fin`;

    const FILE_TO_UPDATE_MULTIPLE_FRAGMENT = `My Top
# START_CONFIT_GENERATED_CONTENT
Fragment 1
# END_CONFIT_GENERATED_CONTENT
Foo
# START_CONFIT_GENERATED_CONTENT
Fragment 2
# END_CONFIT_GENERATED_CONTENT
      My Fin`;

    beforeEach(() => {
      mockReadFile = [];
      mockWriteFile = '';
      mockOutputData = '';
      mockThis = {
        fs: {
          read: (param) => {
            mockReadFile.push(param);
            return param;
          },
          write: (outFile, output) => {
            mockWriteFile = outFile;
            mockOutputData = output;
          },
        },
        renderEJS: renderEJS,
      };
    });

    it('should create a YAML file if a file does not exist and parse the template value', () => {
      mockThis.fs.exists = () => false;
      mockThis.fs.read = () => SINGLE_FRAGMENT_TEMPLATE;
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateYAMLFile.call(mockThis, 'readFile.yml.tpl', 'destFile.yml', templateData);

      assert.equal(mockWriteFile, 'destFile.yml');
      assert.equal(mockOutputData, `Top
# START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
# END_CONFIT_GENERATED_CONTENT
      Fin`);
    });


    it('should update a YAML file when the file exists, modifying just the template fragment', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_SINGLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateYAMLFile.call(mockThis, 'readFile.yml.tpl', 'destFile.yml', templateData);

      assert.equal(mockOutputData, `My Top
# START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
# END_CONFIT_GENERATED_CONTENT
      My Fin`);
    });

    it('should not update a YAML file when the file exists but does not contain any fragments', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return 'foo bar'; // existing file does not have any fragments inside it
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateYAMLFile.call(mockThis, 'readFile.yml.tpl', 'destFile.yml', templateData);

      assert.equal(mockOutputData, `foo bar`);
    });

    it('should replace all the fragments in a YAML file when the file exists, removing dest-file fragements which don\'t have a corresponding template fragment', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return SINGLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_MULTIPLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateYAMLFile.call(mockThis, 'readFile.yml.tpl', 'destFile.yml', templateData);

      assert.equal(mockOutputData, `My Top
# START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
# END_CONFIT_GENERATED_CONTENT
Foo
      My Fin`);
    });

    it('should replace all the fragments in a YAML file when the file exists, adding template fragments when the dest-file has less fragments', () => {
      let readCount = 0;
      mockThis.fs.exists = () => true;
      mockThis.fs.read = () => {
        if (readCount === 0) {
          readCount++;
          return MULTIPLE_FRAGMENT_TEMPLATE;
        }
        return FILE_TO_UPDATE_SINGLE_FRAGMENT;
      };
      const templateData = {templateValue: 'Bravo'};
      fileUtils.updateYAMLFile.call(mockThis, 'readFile.yml.tpl', 'destFile.yml', templateData);

      assert.equal(mockOutputData, `My Top
# START_CONFIT_GENERATED_CONTENT
      Alpha Bravo
# END_CONFIT_GENERATED_CONTENT

# START_CONFIT_GENERATED_CONTENT
      Zulu
# END_CONFIT_GENERATED_CONTENT
      My Fin`);
    });
  });
});
