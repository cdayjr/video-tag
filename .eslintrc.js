module.exports = {
  "extends": ['airbnb-base', 'plugin:prettier/recommended', "plugin:compat/recommended"],
  plugins: ['prettier', 'tslint', "compat"],
  parser: "typescript-eslint-parser",
  rules: {
    "tslint/config": ["warn", {
      lintFile: './.tslint.yaml',
      configFile: './tsconfig.json'
    }],
  },
  env: {
    browser: true
  },
  settings: {
    polyfills: ['urlsearchparams']
  }
};
