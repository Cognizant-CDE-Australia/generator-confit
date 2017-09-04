{
    "check-coverage": true,
    "per-file": true,
    "lines": 40,
    "statements": 40,
    "functions": 20,
    "branches": 50,
    "include": [
      "<%- paths.input.srcDir %>**/*.js"
    ],
    "exclude": [
      "<%- paths.input.unitTestDir %>**/*.spec.js"
    ],
    "reporter": [
      "lcovonly",
      "html",
      "text",
      "cobertura",
      "json"
    ],
    "cache": true,
    "all": true,
    "report-dir": "./<%- paths.output.reportDir + resources.testUnit.coverageReportSubDir %>"
}
