'use strict';

module.exports = {

  types: [
    {value: 'feat',     name: 'feat:     A new feature'},
    {value: 'fix',      name: 'fix:      A bug fix'},
    {value: 'docs',     name: 'docs:     Documentation only changes'},
    {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'perf',     name: 'perf:     A code change that improves performance'},
    {value: 'test',     name: 'test:     Adding missing tests'},
    {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
    {value: 'revert',   name: 'revert:   Revert to a commit'},
    {value: 'WIP',      name: 'WIP:      Work in progress'}
  ],

  scopes: [
    {name: 'generator'},
    {name: 'app'},
    {name: 'nodeApp'},
    {name: 'browserApp'},
    {name: 'build'},
    {name: 'documentation'},
    {name: 'entryPoint'},
    {name: 'paths'},
    {name: 'release'},
    {name: 'sampleApp'},
    {name: 'server'},
    {name: 'testSystem'},
    {name: 'testUnit'},
    {name: 'testVisualRegression'},
    {name: 'verify'},
    {name: 'zzfinish'}
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
   scopeOverrides: {
   fix: [

   {name: 'merge'},
   {name: 'style'},
   {name: 'e2eTest'},
   {name: 'unitTest'}
   ]
   },
   */

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix']

};
