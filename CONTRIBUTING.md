# Contributing

Welcome! Thanks for taking some time to find out more about how you can make Confit even better.

## Before you start

- Be friendly, courteous & professional at all times. This is not the Linux repo.
- Following these guidelines will help you get your changes made to the main repo in the shortest amount of time
- If you have any questions, ask them by raising an issue. Simple!

## Getting Started

Contributing follows the basic Github pattern: Fork, make changes, test, create a pull request, discuss/tune/refactor, changes are merged back into main repo.

### Fork
1. Install Yeoman: `npm i -g yo`
1. Uninstall Confit (if you already had it installed): `npm uninstall -g generator-confit`
1. Fork the repo into a directory, then:

```console
cd path/to/this/repo
npm link
npm install

# Now test it in a new folder
cd ..
mkdir test-app
cd test-app
yo confit

```

### Make changes

**To commit changes, run `npm run commit`.** This tool uses commitizen and asks you a serious of questions about the commit, to help you document it correctly.

*What kind of changes do you want to make?*

#### I want to change the generated common configuration files (e.g. `eslint`, `.gitignore`)

Considerations:
- Probably the simplest kind of changes that can be made.
- Find which generator and/or buildTool is hosting the template-version of the file, then make the changes.

#### I want to change the generated sample project (to make it prettier, more functional, etc)

Considerations:
- The sampleApp generator is one of the more complex generators because it needs to know about the configuration of other generators
- There is a Protractor spec and Page Object which verifies that the sample app has been built correctly. Run `npm test` and verify that it runs successfully
- Much of the sampleApp config relies on knowing the values of `buildJS.sourceFormat` and `buildJS.framework`. See existing code for how this is used to produce a language-and-framework specific sample app.
 

Files that you will need to look at:
- generators/sampleApp
- lib/resources.yml
- buildTool/\<tool (Webpack at this point in time)>/sampleApp
- test/protractorSpec

#### I want to change the generated `README.md` file

Considerations:
- The `README.md` is generated from fragments in the YAML files
- It should only show information that is relevant to the generated config. For example, it should not refer to using tool 'X' if that tool has not been generated.

Files that you will need to look at:
- lib/resources.yml
- buildTool/\<tool>/\<tool>.yml

#### I want to update the dev|test|dependencies versions used by the build tools

Considerations:
- Should be straightforward

Files:
- lib/packages.yml

#### I want to add **new** dev|test|dependencies for the sample project or build tools

Considerations:
- If you are deprecating old tools, please mark this as a BREAKING CHANGE when committing

Files:
- lib/packages.yml
- generators/\<generator>
- buildTool/\<tool>/\<generator>

#### I want to add/change the questions asked by Confit \<generator>

Considerations:
- Need to change both the question AND ensure that the answer is used by each build-tool

Files:
- generators/\<generator>
- buildTool/\<tool>/\<generator>


### Test

Run `npm run test`. This does 3 things:
- Updates the test-fixtures in `test/fixtures`, which are the Confit configurations which are used during integration testing. You **must** commit these files if they are changed
- Runs unit tests (seconds)
- Runs integration tests (minutes)

### Create a PR
*Coming soon*

But basically:
- create a PR detailing the changes
- discuss further improvements (if any)
- await the changes to merged into the main repo


## Yeoman tips

Yeoman generators have [several key methods](http://yeoman.io/authoring/running-context.html) that will be called in a specific order. Respect this order.


## Architecture

Confit is made up of multiple generators:

- `app` - the main generator which loads sub-generators
  - is different from the sub-generators because it doesn't use buildTools nor is it associated with a project-type
- `<sub-generators>` - each sub generator:
  - can have common behaviour regardless of the project type
  - can be a project-type-specific generator (e.g. `buildBrowser`)
  - has a `buildTool` (e.g. `buildTool/<tool>/<generatorName>/<generatorName>.js`)
