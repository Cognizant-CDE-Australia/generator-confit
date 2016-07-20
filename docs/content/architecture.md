Confit is a Yeoman generator, composed of multiple sub-generators that are further composed into project-specific build-tools. 
Each generator creates configuration and tooling for a discrete part of the development process.

- `app` - the main generator which loads sub-generators
  - is different from the sub-generators because it doesn't use buildTools nor is it associated with a project-type
- `<sub-generators>` - each sub generator:
  - can have common behaviour regardless of the project type
  - can be a project-type-specific generator (e.g. `buildBrowser`)
  - has a `buildTool` (e.g. `buildTool/<tool>/<generatorName>/<generatorName>.js`)


## Generators

This section describes the purpose and behaviour of each generator 

### app

The `app` generator is all about capturing application-wide settings and generating application-wide tools & config.

#### Questions

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| **col 3 is**  | right-aligned | $1600 |
| col 2 is      | *centered*    |   $12 |
| zebra stripes | ~~are neat~~  |    $1 |

### buildAssets

### buildBrowser

### buildCSS

### buildHTML

### buildJS

### entryPoint

### paths

### release

### sampleApp

### serverDev

### serverProd

### testBrowser

### testUnit

### verify

### zzfinish
