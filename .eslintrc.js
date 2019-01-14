module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:compat/recommended",
    "plugin:jest/recommended"
  ],
  plugins: ["prettier", "tslint", "compat", "jest", "import"],
  parser: "typescript-eslint-parser",
  rules: {
    "tslint/config": [
      "warn",
      {
        lintFile: "./.tslint.yaml",
        configFile: "./tsconfig.json"
      }
    ],
    "no-plusplus": 0
  },
  env: {
    browser: true
  },
  settings: {
    "import/resolver": {
      "typescript": {},
    }
  }
};
