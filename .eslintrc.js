module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    parser: 'babel-eslint',
  },

  extends: [
    'airbnb-base',
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
};
