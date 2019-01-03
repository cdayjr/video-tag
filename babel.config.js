const presets = [
  [
    "@babel/env",
    {
      target: "> 0.25%, not dead",
      useBuiltIns: "usage"
    }
  ]
];

const plugins = ["transform-modern-regexp"];

module.exports = {
  presets
};
