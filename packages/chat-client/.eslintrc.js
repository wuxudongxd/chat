module.exports = {
  extends: ["alloy", "alloy/react", "alloy/typescript"],
  env: {
    browser: true,
    node: true,
  },
  globals: {},
  rules: {
    "no-param-reassign": "off",
    // https://typescript-eslint.io/docs/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    "no-undef": "off",
    "max-nested-callbacks": "off",
    "react/jsx-key": "off",
  },
};
