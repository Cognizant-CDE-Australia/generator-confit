[wrap class="{$ styles.lead $}"]**Confit** is a Yeoman generator that generates web-development tools for the main development processes in web projects.
- Developing code
- Building
- Verifying code style (linting)
- Testing code
- Packaging code
- Releasing code
- Documenting code
[/wrap]

The tooling is generated by answering a series of simple questions about your project, turning a process that used to take weeks to
tune correctly, into a 5 minute step.
 
*Out of the box, Confit can generate a sample project for the settings you've chosen and so you can see that everything works!*

## Purpose

Confit is designed to get you *started* writing code, but it is not designed to be a code-generation tool. Rather,
Confit will generate *the tools and configuration* to allow you to compile, lint, test, document, package and release your code.

To help you write great software, Confit asks the following questions:
- what kind of project you want: a NodeJS library or a browser-based application.
- source language (what language you want to write your source code with)
- target language (what language you want to compile the code to)
- linting/coding standard
- paths of typical directories, to help organise your code
- the entry-point of your application
- whether you wish to use  [semantic-release](https://github.com/semantic-release/semantic-release) to help you version your code and generate changelogs every time you merge code back to the master branch
- ...*plus a few project-specific questions*

**Confit captures what you *intend to do*, and provides the tools & config that allow you to do it**

## Vision

Confit is designed to be extensible and upgradeable. When better tools become available, users can upgrade
to use those tools without having to spend the time to figure out how to integrate them into their own custom build config.

Confit aims to codify best practices around building, testing and releasing source code.
