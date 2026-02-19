# Example configuration for Jest 30 running CommonJS Javascript

This project shows using Babel to transform Commander ESM to CommonJS.

Example error message when requiring ESM-only Commander in a Jest test with default configuration:

```
$ npm run --silent test
 FAIL  ./index.test.js
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    [more detail omitted, check output for up-to-date suggestions]
...
    SyntaxError: Cannot use import statement outside a module

    > 1 | const { Command } = require('commander');
...
```

Additional install:

```console
npm install --save-dev @babel/preset-env
```

Additional setup:

- add `babel.config.js` to configure babel for smart setup for current node version
- add `transformIgnorePatterns` to `jest.config.js` to process Commander from `node_modules`

Running test:

```console
npm install
npm test
```
