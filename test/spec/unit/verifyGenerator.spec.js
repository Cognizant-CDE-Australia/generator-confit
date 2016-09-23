'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'verify';


describe('Verify Test Generator', () => {
  it('should should generate default config values (for browser with Stylus)', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'verify-stylus-config.yml',
      function before() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config, undefined);
      },
      function after() {
        yoassert.file(['confit.yml', 'package.json', '.eslintignore', 'config/verify/.eslintrc', 'config/verify/.stylintrc']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config.jsCodingStandard, 'none');

        // The package.json file should have verify commands
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts.verify, 'npm-run-all verify:js verify:css --silent');
        assert.equal(pkg.scripts['verify:watch'], 'npm-run-all --parallel verify:js:watch verify:css:watch --silent');
        assert.equal(pkg.scripts['verify:js'], 'eslint -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js success');
        assert.equal(pkg.scripts['verify:js:fix'], 'eslint --fix -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js:fix success');
        assert.equal(pkg.scripts['verify:js:watch'], 'chokidar \'sourceDir/**/*.js\' \'unitTestDir/**/*.js\' \'config/**/*.js\' -c \'npm run verify:js:fix\' --initial --silent');
        assert.equal(pkg.scripts['verify:css'], 'stylint -c config/verify/.stylintrc sourceDir/ && echo ✅ verify:css success');
        assert.equal(pkg.scripts['verify:css:watch'], 'chokidar \'sourceDir/**/*.styl\' -c \'npm run verify:css\' --initial --silent');

        done();
      }
    );
  });


  it('should should allow the JS coding standard to be changed (for browser with SASS)', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'verify-sass-config.yml',
      function before() {},
      function after() {
        yoassert.file(['confit.yml', 'package.json', '.eslintignore', 'config/verify/.eslintrc', 'config/verify/sasslint.yml']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config.jsCodingStandard, 'AirBnB');

        // The package.json file should have verify commands
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts.verify, 'npm-run-all verify:js verify:css --silent');
        assert.equal(pkg.scripts['verify:watch'], 'npm-run-all --parallel verify:js:watch verify:css:watch --silent');
        assert.equal(pkg.scripts['verify:js'], 'eslint -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js success');
        assert.equal(pkg.scripts['verify:js:fix'], 'eslint --fix -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js:fix success');
        assert.equal(pkg.scripts['verify:js:watch'], 'chokidar \'sourceDir/**/*.js\' \'unitTestDir/**/*.js\' \'config/**/*.js\' -c \'npm run verify:js:fix\' --initial --silent');
        assert.equal(pkg.scripts['verify:css'], 'sass-lint -c config/verify/sasslint.yml --verbose && echo ✅ verify:css success');
        assert.equal(pkg.scripts['verify:css:watch'], 'chokidar \'sourceDir/**/*.sass\' \'sourceDir/**/*.scss\' -c \'npm run verify:css\' --initial --silent');

        done();
      }
    ).withPrompts({
      jsCodingStandard: 'AirBnB'
    });
  });


  it('should should generate default config values for TypeScript (for Browser with CSS)', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'verify-typescript-config.yml',
      function before() {},
      function after(testDir) {
        yoassert.file(['confit.yml', 'package.json', '.eslintignore', 'config/verify/tslint.json']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config.jsCodingStandard, 'TypeScript');

        // The package.json file should have verify commands
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts.verify, 'npm-run-all verify:js verify:css --silent');
        assert.equal(pkg.scripts['verify:watch'], 'npm-run-all --parallel verify:js:watch verify:css:watch --silent');
        assert.equal(pkg.scripts['verify:js'], 'tslint -c config/verify/tslint.json "sourceDir/**/*.ts" "unitTestDir/**/*.ts" "config/**/*.ts" && echo ✅ verify:js success');
        assert.equal(pkg.scripts['verify:js:watch'], 'chokidar \'sourceDir/**/*.ts\' \'unitTestDir/**/*.ts\' \'config/**/*.ts\' -c \'npm run verify:js\' --initial --silent');
        assert.equal(pkg.scripts['verify:css'], 'echo  && echo ✅ verify:css success');
        assert.equal(pkg.scripts['verify:css:watch'], 'echo  && echo ✅ verify:css success');

        done();
      }
    );
  });


  it('should should generate default config values (for Node)', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'verify-node-config.yml',
      function before() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config, undefined);
      },
      function after() {
        yoassert.file(['confit.yml', 'package.json', '.eslintignore', 'config/verify/.eslintrc']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].verify;

        assert.equal(config.jsCodingStandard, 'none');

        // The package.json file should have verify commands
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts.verify, 'npm run verify:js --silent');
        assert.equal(pkg.scripts['verify:watch'], 'npm run verify:js:watch --silent');

        assert.equal(pkg.scripts['verify:js'], 'eslint -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js success');
        assert.equal(pkg.scripts['verify:js:fix'], 'eslint --fix -c config/verify/.eslintrc "sourceDir/**/*.js" "unitTestDir/**/*.js" "config/**/*.js" && echo ✅ verify:js:fix success');
        assert.equal(pkg.scripts['verify:js:watch'], 'chokidar \'sourceDir/**/*.js\' \'unitTestDir/**/*.js\' \'config/**/*.js\' -c \'npm run verify:js:fix\' --initial --silent');
        assert.equal(pkg.scripts['verify:css'], undefined);
        assert.equal(pkg.scripts['verify:css:watch'], undefined);

        done();
      }
    );
  });
});
