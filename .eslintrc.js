module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:compat/recommended",
    "plugin:jest/recommended"
  ],
  plugins: ["prettier", "compat", "jest", "import"],
  parser: "typescript-eslint-parser",
  rules: {
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
