/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

// eslint-disable-next-line security/detect-non-literal-fs-filename
const file = fs.readFileSync(path.resolve(__dirname, "./eslint.yaml"), "utf8");

const eslintConfig = yaml.parse(file);

// set relative root directory
eslintConfig.parserOptions.tsconfigRootDir = __dirname;

module.exports = eslintConfig;
