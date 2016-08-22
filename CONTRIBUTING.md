# Contributing to Confit

We understand that you may not have days at a time to work on Confit. We ask that you read our contributing guidelines carefully so that you spend less time, overall, struggling to push your PR through our code review processes.

At the same time, reading the contributing guidelines will give you a better idea of how to post meaningful issues that will be more easily be parsed, considered, and resolved. A big win for everyone involved! :tada:

## Table of Contents

A high level overview of our contributing guidelines.

- [Effective issue reporting in Confit](#effective-issue-reporting-in-confit)
  - [Voicing the importance of an issue](#voicing-the-importance-of-an-issue)
  - ["My issue isn't getting enough attention"](#my-issue-isnt-getting-enough-attention)
  - ["I want to help!"](#i-want-to-help)
- [Making changes](#making-changes)
- [Contributing Code](#contributing-code)
  - [Setting Up Your Development Environment](#setting-up-your-development-environment)
  - [Linting](#linting)
  - [Testing](#testing)
  - [Before pushing changes](#before-pushing-changes)
- [Signing the contributor license agreement](#signing-the-contributor-license-agreement)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [ Code Reviewing](#code-reviewing)
  - [Getting to the Code Review Stage](#getting-to-the-code-review-stage)
  - [Reviewing Pull Requests](#reviewing-pull-requests)

Don't fret, it's not as daunting as the table of contents makes it out to be!

## Effective issue reporting in Confit

At any given time the Confit team at Odecee is working on dozens of features and enhancements, both for Confit itself and for a few other projects at Odecee. When you file an issue, we'll take the time to digest it, consider solutions, and weigh its applicability to both the Confit user base at large and the long-term vision for the project. Once we've completed that process we will assign the issue a priority.

- **P1**: A high-priority issue that affects virtually all Confit users. Bugs that would cause incorrect results, security issues and features that would vastly improve the user experience for everyone. Work arounds for P1s generally don't exist without a code change.
- **P2**: A broadly applicable, high visibility, issue that enhances the usability of Confit for a majority users.
- **P3**: Nice-to-have bug fixes or functionality. Work arounds for P3 items generally exist.
- **P4**: Niche and special interest issues that may not fit our core goals. We would take a high quality pull for this if implemented in such a way that it does not meaningfully impact other functionality or existing code. Issues may also be labeled P4 if they would be better implemented in Odeceesearch.
- **P5**: Highly niche or in opposition to our core goals. Should usually be closed. This doesn't mean we wouldn't take a pull for it, but if someone really wanted this they would be better off working on a plugin. The Confit team will usually not work on P5 issues but may be willing to assist plugin developers on IRC.

### Voicing the importance of an issue

We seriously appreciate thoughtful comments. If an issue is important to you, add a comment with a solid write up of your use case and explain why it's so important. Please avoid posting comments comprised solely of a thumbs up emoji 👍.

Granted that you share your thoughts, we might even be able to come up with creative solutions to your specific problem. If everything you'd like to say has already been brought up but you'd still like to add a token of support, feel free to add a [👍 thumbs up reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments) on the issue itself and on the comment which best summarizes your thoughts.

### "My issue isn't getting enough attention"

First of all, **sorry about that!** We want you to have a great time with Confit.

There's hundreds of open issues and prioritizing what to work on is an important aspect of our daily jobs. We prioritize issues according to impact and difficulty, so some issues can be neglected while we work on more pressing issues.

Feel free to bump your issues if you think they've been neglected for a prolonged period!

### "I want to help!"

**Now we're talking**. If you have a bug fix or new feature that you would like to contribute to Confit, please **find or open an issue about it before you start working on it.** Talk about what you would like to do. It may be that somebody is already working on it, or that there are particular issues that you should know about before implementing the change.

We enjoy working with contributors to get their code accepted. There are many approaches to fixing a problem and it is important to find the best approach before writing too much code.


## Making Changes
The following is a list of common things that you may wish to change about Confit, and some tips as to 
how to make those changes.

*Testing is an implicit consideration for **every** change that you would like to make*. 

### I want to change the generated common configuration files (e.g. `eslint`, `.gitignore`)

Considerations:
- Probably the simplest kind of changes that can be made.
- Find which generator and/or buildTool is hosting the template-version of the file, then make the changes.

### I want to change the generated sample project (to make it prettier, more functional, etc)

Considerations:
- The sampleApp generator is one of the more complex generators because it needs to know about the configuration of other generators
- There is a Protractor spec and Page Object which verifies that the sample app has been built correctly. Run `npm test` and verify that it runs successfully
- Much of the sampleApp config relies on knowing the values of `buildJS.sourceFormat` and `buildJS.framework`. See existing code for how this is used to produce a language-and-framework specific sample app.
 

Files that you will need to look at:
- lib/generators/sampleApp
- lib/resources.yml
- lib/buildTool/\<tool (Webpack at this point in time)>/sampleApp
- test/protractorSpec

### I want to change the generated `README.md` file

Considerations:
- The `README.md` is generated from fragments in the YAML files
- It should only show information that is relevant to the generated config. For example, it should not refer to using tool 'X' if that tool has not been generated.

Files that you will need to look at:
- lib/resources.yml
- lib/buildTool/\<tool>/\<tool>.yml

### I want to update the dev|test|dependencies versions used by the build tools

Considerations:
- Should be straightforward

Files:
- lib/packages.yml

### I want to add **new** dev|test|dependencies for the sample project or build tools

Considerations:
- If you are deprecating old tools, please mark this as a BREAKING CHANGE when committing

Files:
- lib/core/packages.yml
- lib/generators/\<generator>
- lib/buildTool/\<tool>/\<generator>

### I want to add/change the questions asked by Confit \<generator>

Considerations:
- Need to change both the question AND ensure that the answer is used by each build-tool

Files:
- lib/generators/\<generator>
- lib/buildTool/\<tool>/\<generator>



## Contributing Code

These guidelines will help you get your Pull Request into shape so that a code review can start as soon as possible.

### Setting Up Your Development Environment

Clone the `Confit` repo and change directory into it

```bash
git clone https://github.com/odecee/generator-confit.git 
cd generator-confit
```

Install Node.js 4+ or 6+ _(this can be easily automated with tools such as [nvm](https://github.com/creationix/nvm))

```bash
nvm install 6
#   OR
nvm install 4
```

Install global dependencies, local dependencies then `npm link` this directory so you can test changes locally

```bash
npm i -g yo  
npm i -g commitizen
npm install
npm link
```

Now test it in a new folder.

```bash
cd ..
mkdir test-app
cd test-app
yo confit
```

### Linting

A note about linting: We use [eslint](http://eslint.org) to check that the [styleguide](STYLEGUIDE.md) is being followed. It runs in a pre-commit hook and as a part of the tests, but most contributors integrate it with their code editors for real-time feedback.

Here are some hints for getting eslint setup in your favorite editor:

Editor     | Plugin
-----------|-------------------------------------------------------------------------------
Sublime    | [SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint#installation)
Atom       | [linter-eslint](https://github.com/AtomLinter/linter-eslint#installation)
IntelliJ   | Settings » Languages & Frameworks » JavaScript » Code Quality Tools » ESLint
`vi`       | [scrooloose/syntastic](https://github.com/scrooloose/syntastic)

Another tool we use for enforcing consistent coding style is EditorConfig, which can be set up by installing a plugin in your editor that dynamically updates its configuration. Take a look at the [EditorConfig](http://editorconfig.org/#download) site to find a plugin for your editor, and browse our [`.editorconfig`](https://github.com/elastic/Confit/blob/master/.editorconfig) file to see what config rules we set up.


### Testing

The standard `npm run test` task runs several sub tasks and can take several minutes to complete:
- Updates the test-fixtures in `test/fixtures`, which are the Confit configurations which are used during integration testing. You **must** commit these files if they are changed
- Runs unit tests (seconds)
- Runs integration tests (minutes)


Use `npm run test:unit` when you want to run only the unit tests.

```bash
npm run test:unit
```

When you just want to update the fixture files:

```bash
npm run updateFixtures
```

#### Integration tests
The integration tests install Confit for each of the [test fixtures](test/fixtures), start up the sample
project and check that the generated-tooling is working as expected. This process takes 3-5 minutes 
per fixture, depending on network speed. 

It is possible to run the tests for a *single* fixture by adding a `-` to the start of the fixture name: `-node.es6.yml`
**Remember to unprefix the fixture before committing your changes.** 


### Before pushing changes

To ensure that your changes will not break other functionality, please run the pre-release task before submitting your Pull Request.

Before running the tests you will need to install the projects dependencies as described above.

Once that's done, just run:

```bash
npm run pre-release
```

This command will lint the code, run the unit tests and run the integration tests.

There is also a Git push-hook which will lint the code and run the unit tests. You will need to fix any errors before pushing to your remote repo. 


## Signing the contributor license agreement

Please make sure you have signed the [Contributor License Agreement](https://docs.google.com/a/odecee.com.au/forms/d/1EmjFp3rJYnQU2pFX0A1hgSaHRoAaB_6PUopmmSmeByg/viewform?usp=send_form). We are not asking you to assign copyright to us, but to give us the right to distribute your code without restriction. We ask this of all contributors in order to assure our users of the origin and continuing existence of the code. You only need to sign the CLA once.

## Submitting a Pull Request

Push your local changes to your forked copy of the repository and submit a Pull Request. In the Pull Request, describe what your changes do and mention the number of the issue where discussion has taken place, eg “Closes #123″.

Always submit your pull against `master` unless the bug is only present in an older version. If the bug effects both `master` and another branch say so in your pull.

Then sit back and wait. There will probably be discussion about the Pull Request and, if any changes are needed, we'll work with you to get your Pull Request merged into Confit.

## Code Reviewing

After a pull is submitted, it needs to get to review. If you have commit permission on the Confit repo you will probably perform these steps while submitting your Pull Request. If not, a member of the Odecee organization will do them for you, though you can help by suggesting a reviewer for your changes if you've interacted with someone while working on the issue.

### Getting to the Code Review Stage

1. Assign the `review` label. This signals to the team that someone needs to give this attention.
1. Do **not** assign a version label. Confit uses [semantic-release](https://github.com/semantic-release/semantic-release) with conventional commit messages to determine the version label. Make sure you commit changes with conventional commit messages.
1. Find someone to review your pull. Don't just pick any yahoo, pick the right person. The right person might be the original reporter of the issue, but it might also be the person most familiar with the code you've changed. If neither of those things apply, or your change is small in scope, try to find someone on the Confit team without a ton of existing reviews on their plate. As a rule, most pulls will require 2 reviewers, but the first reviewer will pick the 2nd.

### Reviewing Pull Requests

So, you've been assigned a pull to review. What's that look like?

Remember, someone is blocked by a pull awaiting review, make it count. Be thorough, the more action items you catch in the first review, the less back and forth will be required, and the better chance the pull has of being successful.

1. **Understand the issue** that is being fixed, or the feature being added. Check the description on the pull, and check out the related issue. If you don't understand something, ask the submitter for clarification.
1. **Reproduce the bug** (or the lack of feature I guess?) in the destination branch, usually `master`. The referenced issue will help you here. If you're unable to reproduce the issue, contact the issue submitter for clarification
1. **Check out the pull** and test it. Is the issue fixed? Does it have nasty side effects? Try to create suspect inputs. If it operates on the value of a field try things like: strings (including an empty string), null, numbers, dates. Try to think of edge cases that might break the code.
1. **Merge the target branch**. It is possible that tests or the linter have been updated in the target branch since the pull was submitted. Merging the pull could cause core to start failing.
1. **Read the code**. Understanding the changes will help you find additional things to test. Contact the submitter if you don't understand something.
1. **Go line-by-line**. Are there coding style violations? Strangely named variables? Magic numbers? Do the abstractions make sense to you? Are things arranged in a testable way?
1. **Speaking of tests** Are they there? If a new function was added does it have tests? Do the tests, well, TEST anything? Do they just run the function or do they properly check the output?
1. **Suggest improvements** If there are changes needed, be explicit, comment on the lines in the code that you'd like changed. You might consider suggesting fixes. If you can't identify the problem, animated screenshots can help the review understand what's going on.
1. **Hand it back** If you found issues, re-assign the submitter to the pull to address them. Repeat until mergable.
1. **Hand it off** If you're the first reviewer and everything looks good but the changes are more than a few lines, hand the pull to someone else to take a second look. Again, try to find the right person to assign it to.
1. **Merge the code** When everything looks good, merge into the target branch. Check the labels on the pull to see if backporting is required, and perform the backport if so.

Thank you so much for reading our guidelines! :tada:
