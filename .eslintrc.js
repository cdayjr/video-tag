module.exports = {
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:compat/recommended",
    "plugin:jest/recommended"
  ],
  plugins: ["typescript", "prettier", "compat", "jest", "import"],
  parser: "typescript-eslint-parser",
  rules: {
    "no-plusplus": 0,
    "typescript/adjacent-overload-signatures": 2,
    "typescript/class-name-casing": 2,
    "typescript/explicit-function-return-type": 2,
    "typescript/explicit-member-accessibility": 2,
    "typescript/generic-type-naming": 2,
    "typescript/interface-name-prefix": 2,
    "typescript/member-delimiter-style": 2,
    "typescript/member-naming": 2,
    "typescript/member-ordering": 2,
    "typescript/no-angle-bracket-type-assertion": 2,
    "typescript/no-array-constructor": 2,
    "typescript/no-empty-interface": 2,
    "typescript/no-explicit-any": 2,
    "typescript/no-inferrable-types": [2, {
      "ignoreProperties": true,
      "ignoreParameters": true
    }],
    "typescript/no-namespace": 2,
    "typescript/no-non-null-assertion": 2,
    "typescript/no-parameter-properties": 2,
    "typescript/no-triple-slash-reference": 2,
    "typescript/no-type-alias": 2,
    "typescript/no-unused-vars": 2,
    "typescript/no-use-before-define": 2,
    "typescript/no-var-requires": 2,
    "typescript/type-annotation-spacing": 2
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
