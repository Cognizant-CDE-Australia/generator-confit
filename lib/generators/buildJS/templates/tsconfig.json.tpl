{
  "compilerOptions": {
    "target": "<%= buildJS.outputFormat %>",
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "noEmitHelpers": true,
    "strictNullChecks": false,
    "paths": {
    },
    "lib": [
      "dom",
      "es6"
    ],
    "types": [
      <% // Not all of these types are required. Need to load framework-specific types explicitly.
         // Currently these are the Angular 2 types. %>
      "jasmine",
      "node",
      "protractor",
      "selenium-webdriver",
      "source-map",
      "uglify-js",
      "webpack"
    ]
  },
  "exclude": [
    "node_modules"
  ],
  "include": [
    "./<%= paths.input.srcDir %>**/*.ts"
  ],
  "awesomeTypescriptLoaderOptions": {
    "forkChecker": true,
    "useWebpackText": true
  },
  "compileOnSave": false,
  "buildOnSave": false,
  "atom": {
    "rewriteTsconfig": false
  }
}
