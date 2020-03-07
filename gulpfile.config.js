/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
//const skill = require('./secrets/skill.config.json');

class GulpConfig {
  BuildMode = Object.freeze({
    "production": "production",
    "dev": "dev"
  });

  ActiveComponents = {
    "lambda": false,
    "build": true,
    "docs": true,
    "mocha": true,
    "eslint": true,
    "watch": false,
    "yogen": false,
    "npm": true,
    "statics": true,
    "skill": false
  };

  Paths = {
    // source
    sourcePath: "src",

    // test
    testPath: "src",

    // target
    targetPath: "dist",

    // docs
    docsPath: "docs"
  };

  buildMode = null;

  setBuildMode = (value) => {
    this.buildMode = value;
    if (value === this.BuildMode.dev) {
      this.tsConfigFile = "tsconfig.json";
    } else {
      this.tsConfigFile = "tsconfig.build.json";
    }
    return this.buildMode;
  };

  // GulpConfig = {

  // buildMode: this.buildMode,

  tsConfigFile = "";

  // Root path
  rootPath = __dirname;

  // source
  sourcePath = this.Paths.sourcePath;

  tsSourceFiles = this.Paths.sourcePath + "/**/*.ts";

  // test
  testPath = this.Paths.testPath;
  testFiles = `${this.Paths.testPath}/**/*.ts`;

  // target
  targetPath = this.Paths.targetPath;

  // docs
  docsPath = this.Paths.docsPath;

  docsFiles = this.Paths.docsPath + "/**/*";

  // Static files
  statics = [
    {
      sourcePath: `${this.Paths.sourcePath}/assets/**`,
      targetPath: `${this.Paths.targetPath}/assets`
    }
  ];

  npmLink = [
    // {
    //   name: 'module-name1',
    //   path: '../'
    // },
    // {
    //   name: 'module-name2',
    //   path: '../'
    // }
  ];
  // lambda: [
  //   {
  //     sourcePath: `${Paths.targetPath}/skill`,
  //     targetFile: `${Paths.targetPath}/lambda.zip`,
  //     params: {
  //       FunctionName: skill.functionArn,
  //       Publish: false
  //     }
  //   }
  // ]
}

const config = new GulpConfig();
module.exports = config;
