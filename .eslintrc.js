const fs = require("fs");
const yaml = require("yaml");

const file = fs.readFileSync(__dirname + "/eslint.yaml", "utf8");

const eslintConfig = yaml.parse(file);

// set relative root directory
eslintConfig.parserOptions.tsconfigRootDir = __dirname;

module.exports = eslintConfig;
