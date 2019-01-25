module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:compat/recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["@typescript-eslint", "prettier", "compat", "jest", "import"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: "."
  },
  rules: {
    "no-plusplus": 0,
    "@typescript-eslint/indent": 0
  },
  env: {
    browser: true
  },
  settings: {
    "import/resolver": {
      typescript: {}
    }
  }
};
