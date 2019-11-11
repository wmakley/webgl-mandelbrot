// NodeJS ESLint config
module.exports = {
  "env": {
    "browser": false,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "workbox": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
  }
};
