{
  "compilerOptions": {
    "target": "<%= buildJS.outputFormat %>",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "noEmitHelpers": true
  },
  "exclude": [
    "node_modules",
    "typings/main.d.ts",
    "typings/main"
  ],
  "filesGlob": [
    "./<%= paths.input.srcDir %>**/*.ts",
    "!./node_modules/**/*.ts",
    "typings/browser.d.ts"
  ],
  "awesomeTypescriptLoaderOptions": {
    "resolveGlobs": true,
    "forkChecker": true
  },
  "compileOnSave": false,
  "buildOnSave": false,
  "atom": {
    "rewriteTsconfig": false
  }
}
