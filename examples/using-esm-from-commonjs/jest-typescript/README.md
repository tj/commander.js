# Example configuration for Jest 30 running CommonJS from TypeScript

This project shows using `ts-jest` to transform Commander ESM to CommonJS.

Example error message when requiring ESM-only Commander in a Jest test with default configuration:

```
$ npm run --silent test
 FAIL  ./index.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    [more detail omitted, check output for up-to-date suggestions]
...
    import { Command } from 'commander';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module
...
```

Additional setup:

- see two tweaks in `jest.config.js` to use `ts-jest` to convert Commander ESM to CommonJS

Running test:

```console
npm install
npm test
```
