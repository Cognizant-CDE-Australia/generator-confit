Confit is a Yeoman generator, composed of multiple sub-generators that are further composed into project-specific build-tools. 
Each generator creates configuration and tooling for a discrete part of the development process.

- `app` is the main generator which loads sub-generators. It is different from the sub-generators because it doesn't use `buildTool`s nor is it associated with a project-type
- `<sub-generators>`:
  - can have common behaviour regardless of the project type
  - can be specific to a project-type (e.g. `buildBrowser` is [render badge list="browser"] specific)
  - has a `buildTool` (e.g. `buildTool/<tool>/<generatorName>/<generatorName>.js`)


## Generators

This section describes the purpose and behaviour of each generator. 

### app [render badge list="browser|node"]


The `app` generator is all about capturing application-wide settings and generating application-wide tools & config.

#### Questions

**Would you like to rebuild from the existing configuration in `confit.json`?** [**Y**, N] (not stored in `confit.json`)
- If `confit.json` was created by the same version of Confit as the version you are using, this question will appear. If a newer (or older) version of Confit is being used than what was used to create `confit.json`, this question is skipped.

**Choose the project type**: [**Browser**, NodeJS]  `app.projectType`
- Browser projects are projects that produce websites, or web-based libraries
- NodeJS projects are purely JavaScript-based and typically require fewer build steps.

**Choose a build profile**: [**Latest**, *list of older profiles...*] `app.buildProfile`
- Over time, Confit will update the tools that are used to produce different kinds of projects.
- The `Latest` build profile is an alias to the newest set of tools and config recommended for projects. It will change every few months as new & better tooling arrives.
- The other profiles will show the date that they were added. This allows projects to update their Confit-generator version but continue to use the same set of tools that were used by Confit on a certain date.

**Where will this project be hosted?** [**GitHub**, BitBucket, Other] `app.repositoryType`
- Repositories hosted on Github or BitBucket can take advantage of repository-specific integrations. E.g. *semantic-release* can generate release information within the "Releases" tab in GitHub.
- Other repositories have fewer integration options. 

**Is this repository public?** [**true**, false] `app.publicRepository`
- Public repositories are repositories that are viewable by everyone.
- This setting affects what Readme badges can be generated, as some badges only work with public repositories
 
**Choose a license**: [**UNLICENSED**, *common SPDX licences*, *full SPDX licence list*] `app.license`
- Sets the `package.json` `license` field and optionally generates the license file (for every license type other than "UNLICENSED").
- Popular licenses are listed first, such as Apache-2.0, GPL and MIT.
- The licence files typically contain templates that must be completed for the licence to be valid.

**Copyright owner**: [***Git user name***] `app.copyrightOwner`
- Adds the copyright owner information to the license file (if one exists).

#### Build Tools
- None

---

### buildAssets [render badge list="browser"]

Generator for building assets (media files) for web applications.

#### Questions
None

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool uses the Confit path information to create Webpack loaders for fonts and images.</li>
</ul>

---

### buildBrowser [render badge list="browser"]

Browser-specific build configuration generator.

#### Questions

**Supported browsers**: [latest, latest2, legacyIE, legacyMobile] `buildBrowser.browserSupport`
- You must select at least one option.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool generates the foundational config for `webpack.config.js`.</li>
</ul>

---

### buildCSS [render badge list="browser"]

CSS-tool generator.

#### Questions

**Source format**: [css, sass, **stylus**] `buildCSS.sourceFormat`
- "Stylus" has the best compiler and most flexibility around syntax (recommended).
- Choosing "css" means there is no compiler (or linter) for the CSS code.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool generates Webpack loaders for the chosen CSS language and target browser support.</li>
</ul>

---

### buildHTML [render badge list="browser"]

#### Questions

**HTML source file extension?** [**.html**, .htm] `buildHTML.extension`
- This question is designed to support other HTML source code formats (e.g. Jade) in the future.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool generates Webpack loaders for the chosen HTML extension and also the `index.html` template file.</li>
</ul>

---

### buildJS [render badge list="browser|node"]

This important generators is used to determine how to process the source code into the desired output format.
It affects the verification (linting) tool selection, code coverage tools and which files to watch for changes.

#### Questions

**Source code language**: [**ES6**, TypeScript] `buildJS.sourceFormat`
- The format that the source code will be written in

**Target output language**: [**ES5 (Browser)**, **ES6 (NodeJS)**] `buildJS.outputFormat`
- The format that the source code should be compiled to before the application is deployed/run
- If the source code language does not equal the target output language, a transpiler (e.g. Babel) will be required.

**JavaScript framework**: [AngularJS 1.x, AngularJS 2.x, React (latest)] `buildJS.framework[]` and `buildJS.frameworkScripts[]`
- Only shown for **Browser** projects.
- Optional - zero-to-many frameworks can be selected, but support for many frameworks is limited.
- Designed to support new popular frameworks in the future (contributors wanted!).
- `buildJS.frameworkScripts[]` is derived from `buildJS.framework[]`

**Vendor scripts OR module-names to include**: [*editable only within `confit.json`*] `buildJS.vendorScripts[]`
- Only shown for **Browser** projects.
- A list of the NPM modules / JS files that are required at run-time for the browser-application to run.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool uses this information extensively to determine which loaders, configuration and files are required to compile source code.</li>
</ul>

---

### entryPoint [render badge list="browser|node"]

#### Questions

**Entry-points for the application (edit in `confit.json`)**: [*editable only within `confit.json`*] `entryPoint.entryPoints`
- A map of entry-points for the application.
- For Browser projects, many entry-points are supported. Each entry-point can have multiple files (specified as an array).
- For NodeJS projects, only one entry-point called `main` is supported. It must contain a single file reference inside the array.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool generates the `entryPoint` configuration from the `entryPoint.entryPoints`. An additional entry-point is also created if `vendorScripts` or `frameworkScripts` are supplied.</li>
<li><div class="{$ styles.badge__npm $}"></div> build tool generates the `main` property inside `package.json` from `entryPoint.entryPoints`.</li>
</ul>

---

### paths [render badge list="browser|node"]

#### Questions

**Use default/existing paths?** [**Y**, N] (not stored in `confit.json`)
- If "Y", then the rest of the path questions are not asked and default values are used.
 

**Path to SOURCE directory (relative to the current directory)**: [src/] `paths.input.srcDir`
- Location of root source code directory within the application.

**Path to MODULES directory (relative to the SOURCE directory)**: [modules/] `paths.input.modulesSubDir`
- Only shown for **Browser** projects.
- Location of modules sub-directory relative to the `paths.input.srcDir` directory.
- This is the only path that is optional.
- Is used to generate `paths.input.modulesDir`, which is a convenient concatenation of `paths.input.srcDir` and `paths.input.modulesSubDir`.
- For browser projects, code is generally organised into modules (features/components) underneath the `paths.input.modulesDir` directory.

**Name of module ASSETS directory (for images, fonts)**: [assets/] `input.assetsDir`
- Only shown for **Browser** projects.
- Name of directory *within each module* that contains assets (images, fonts).

**Name of module STYLES directory (for CSS)**: [styles/] `input.stylesDir`
- Only shown for **Browser** projects.
- Name of directory *within each module* that contains stylesheets.

**Name of module TEMPLATE directory (for component HTML templates)**: [template/] `input.templateDir`
- Only shown for **Browser** projects.
- Name of directory *within each module* that contains HTML templates.

**Name of module UNIT TEST directory**: [unitTest/] `input.unitTestDir`
- Only shown for **Browser** projects.
- Name of directory *within each module* that contains the unit tests for the module.

**Name of module SYSTEM TEST directory**: [systemTest/] `input.systemTestDir`
- Only shown for **Browser** projects.
- Name of directory *within each module* that contains the system/browser tests for the module.

**Path to UNIT TEST directory (relative to the current directory)**: [unitTest/] `input.unitTestDir`
- Only shown for **NodeJS** projects.
- Location of root test directory within the application.


**Path to DEV OUTPUT directory (relative to the current directory)**: [dev/] `paths.output.devDir`
- Only shown for **Browser** projects.
- Location of development-build directory within the application.

**Path to PRODUCTION OUTPUT directory (relative to the current directory)**: [dist/] `paths.output.prodDir`
- Only shown for **Browser** projects.
- Location of production-build directory within the application.

**Path to BUILD directory (relative to the current directory)**: [dist/] `paths.output.prodDir`
- Only shown for **NodeJS** projects.
- Location of build directory within the application.

**Path to ASSETS sub-directory (relative to the OUTPUT directory)**: [assets/] `paths.output.assetsSubDir`
- Only shown for **Browser** projects.
- Name of directory relative to `paths.output.devDir` and `paths.output.prodDir` where the built-asset files will be deployed.

**Path to CSS sub-directory (relative to the OUTPUT directory)**: [css/] `paths.output.cssSubDir`
- Only shown for **Browser** projects.
- Name of directory relative to `paths.output.devDir` and `paths.output.prodDir` where the built-CSS files will be deployed.

**Path to JS sub-directory (relative to the OUTPUT directory)**: [js/] `paths.output.jsSubDir`
- Only shown for **Browser** projects.
- Name of directory relative to `paths.output.devDir` and `paths.output.prodDir` where the built-JS files will be deployed.

**Path to VENDOR JS sub-directory (relative to the OUTPUT directory)**: [vendor/] `paths.output.vendorJSSubDir`
- Only shown for **Browser** projects.
- Name of directory relative to `paths.output.devDir` and `paths.output.prodDir` where the vendor JS files will be deployed.


**Path to TEST REPORTS directory (relative to the current directory)**: [reports/] `paths.output.reportDir`
- Location of the test-reports directory within the application.
- By placing all reports here, it makes it easier for CI systems to accurately find the test reports.

**Path to CONFIG directory (relative to the current directory)**: [config/] `paths.output.reportDir`
- Location of the configuration directory within the application.
- Moving configuration files out of the root folder and into a configuration directory makes the codebase cleaner.

#### Build Tools
- None - but this configuration is used extensively by all build tools.

---

### releases [render badge list="browser|node"]

Generates release-related configuration and tooling.

#### Questions

**Use semantic releasing?** [**Y**, N] `release.useSemantic`
- [Semantic releasing](http://semantic-release.org/) is a development process with a supporting set-of-tools that allows
  software to be versioned & released based automatically by following certain conventions.
- Use this in conjunction with Conventional commit messages (see next question).

**Commit message format**: [**Conventional**, None] `release.commitMessageFormat`
- Semantic releasing mandates the use of conventional commit messages. If `release.useSemantic` is "Y", the only available selection is "Conventional".
- If `release.useSemantic` is "N", then the "None" option becomes available.
- Using conventional commit messages adds the `git cz` command, which helps you create the conventional commit message according to customisable rules.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__npm $}"></div> build tool installs the global "semantic-release-cli" package, which requires further setup post installation. If conventional commit messages are used, some Git hooks and tools are installed to support this. </li>
</ul>

---

### sampleApp [render badge list="browser|node"]
 
It is one of the more-complex generators because it is dependent on the answers captured by other generators.

#### Questions

**Create a sample app?** [**Y**, N] `sampleApp.createSampleApp`
- If the Confit has a sample application for the chosen configuration, then a sample application will be generated.
- Sample apps are designed to provide initial guidance on how to structure a program and demonstrate that the tooling is working correctly.
- Each time Confit is run, it will re-ask this question (even when you've indicated you wish to build from the existing configuration). This is to encourage the user to select "N" once they are happy with the generated sample app. 

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool creates a web application which demonstrates all of the tools working together.</li>
<li><div class="{$ styles.badge__npm $}"></div> build tool creates a NodeJS application which demonstrates all the tools working together. Currently no build step is required, but that is likely to change in future versions.</li>
</ul>


---

### serverDev [render badge list="browser"]
 
Captures server settings for serving the the web application in a development-mode.

#### Questions

**Server port**: [**3000**] `serverDev.port`
- The port of the development web server.

**Server hostname**: [**localhost**] `serverDev.hostname`
- The host-name of the development web server.

**Server protocol**: [**https**, http] `serverDev.protocol`
- The protocol of the development web server.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool uses Webpack's built-in development web server to serve the web application.</li>
</ul>

---

### serverProd [render badge list="browser"]
 
Captures server settings for serving the the web application in a production-mode.

#### Questions

**Server port**: [**3000**] `serverProd.port`
- The port of the production web server.

**Server hostname**: [**localhost**] `serverProd.hostname`
- The host-name of the production web server.

**Server protocol**: [**https**, http] `serverProd.protocol`
- The protocol of the production web server.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__npm $}"></div> build tool uses "serve" or "serve-https" to launch a production web server to serve the web application.</li>
</ul>

---

### testSystem (formerly "testBrowser") [render badge list="browser"]

Generates system testing tools and configuration. For browser applications, this tests the system through a web browser. 

#### Questions
None

#### Build Tools
<ul>
<li><div class="{$ styles.badge__protractor $}"></div> build tool sets up Protractor configuration for testing web application. synchronises with Angular 1.x framework if framework is selected in `buildJS` generator.</li>
</ul>

---

### testUnit [render badge list="browser|node"]

Generates unit-testing tools and configuration.

#### Questions
None

#### Build Tools
<ul>
<li><div class="{$ styles.badge__npm $}"></div> build tool installs Mocha test framework with code coverage.</li>
<li><div class="{$ styles.badge__webpack $}"></div> build tool creates Webpack and Karma configuration (using Jasmine as test framework) with code coverage.</li>
</ul>

---

### verify [render badge list="browser|node"]

Generates code syntax and style-verification tools for JavaScript (and CSS <div class="{$ styles.badge__browser $}"></div> only).

#### Questions
**JavaScript coding standard**: [**None**, AirBnb, Google, StandardJS, TypeScript] `verify.jsCodingStandard`
- The linting rules that will be applied to JavaScript code.
- "TypeScript" is only available for TypeScript projects.

#### Build Tools
<ul>
<li><div class="{$ styles.badge__npm $}"></div> build tool creates `verify:*` commands to verify source code in the `paths.input.srcDir`, `paths.input.unitTestDir` and `paths.input.configDir`.</li>
</ul>

---

### zzfinish [render badge list="browser|node"]

A hook to allow different build tools to generate config after all other generators have run.

#### Questions
- None

#### Build Tools
<ul>
<li><div class="{$ styles.badge__webpack $}"></div> build tool runs the `npm start` command once Confit has finished installing everything (unless `--skip-run` is specified).</li>
</ul>
