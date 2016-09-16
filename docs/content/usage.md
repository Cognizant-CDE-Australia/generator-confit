## Installation

Install Node.js 4+ or 6+ (this can be easily automated with tools such as [nvm](https://github.com/creationix/nvm))

```bash
nvm install 6
#   OR
nvm install 4
```

Install  [Yeoman](https://yeoman.io) and then Confit:

```bash
npm install -g yo
npm install -g generator-confit
```

## Generating a new project with Confit

1. Type `yo confit`
2. Answer questions about the kind of project you want.
3. Wait for the packages to be installed.
4. Type `npm start` to start the project in a development mode.

## Writing code

To write code, run `npm start`. This starts the application in a development mode and watches for changes to code (and tests), verifies the code,
and recompiles the application when changes are detected.

## Testing & Verifying code

When writing code there are two main things you usually want to check as you go:
1. Is my code styled correctly? `npm run verify:watch`, or `npm start`
1. Are my tests breaking? `npm test`

To minimise the chance of errors scrolling off the screen, these two tasks are generally run in separate terminal windows.

You can also run these tasks on an ad-hoc basis:
1. `npm run verify`
1. `npm run test:unit:once`

## Testing in the browser [render badge list="browser"]

You can run `npm run test:browser` to run component and/or system tests in the browser.

## Generating documentation

`npm run docs:build` will create the documentation, while `npm run docs:serve` will also serve it in a browser and watch for
 changes. Documentation is generated using [Swanky](https://github.com/swanky-docs).

## Creating a package & releasing it

Depending on your configuration, you may delegate this process to your continuous integration system (like [Travis](https://travisci.io) or Jenkins),
or you can publish manually (not recommended).

`npm run pre-release` runs all of the unit tests, verifies code, checks test coverage and builds your software for production. If there were
no errors, you can then run `npm run semantic-release` if using semantic releasing.
 
If you are not using semantic releasing, you must define your own `release` task in `package.json` and then call it yourself.

## Adding Confit to an existing project

Before adding Confit to an existing project, there are a few things you should know:
- Confit will create files if they don't exist (e.g. `package.json`)
- Confit will overwrite *sections* within certain files, if those sections exist. This allows you to have a mixture of 
  generated configuration and custom configuration within the same file.
- Confit will *not* overwrite certain files if they already exist.
 
To get an idea of which files will be created by Confit, it is recommended to run Confit with your desired configuration 
in an empty folder first. You can then take the generated `confit.yml` file and place it into the existing folder once
you are happy with the configuration.

1. Make sure you have no outstanding changes to make (`git status` should indicate there is nothing staged or ready to be committed).
2. Run `yo confit`, and choose the configuration you would like.
3. Answer `Yes` to all of the prompts about overwriting files - it's ok, no changes will be committed at this stage 
4. Review the changes that Confit has made. In some cases, you will not want Confit's changes. Use a merging/diffing tool
  (like SourceTree) to select which changes to keep, and which to reject.
5. When you are happy with the changes, commit them.

In the case where Confit does *not* change one of your existing files (such as `README.md`), you may wish to remove that 
file and run `yo confit` to see what Confit will generate. Then you can merge your changes back into the file as part of 
the review process.

