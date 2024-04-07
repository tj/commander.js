const globals = require('globals');
const esLintjs = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
// const jsdoc = require('eslint-plugin-jsdoc');

// Only run tseslint on the files that we have included for TypeScript.
const tsconfigTsFiles = ['**/*.{ts,mts}']; // match "include" in tsconfig.ts.json;
const tsconfigJsFiles = ['*.{js,mjs}', 'lib/**/*.{js,mjs}']; // match "include" in tsconfig.js.json

// Using tseslint.config adds some type safety and `extends` to simplify customising config array.
module.exports = tseslint.config(
  // Add recommended rules.
  esLintjs.configs.recommended,
  // jsdoc.configs['flat/recommended'],
  jest.configs['flat/recommended'],
  // tseslint with different setup for js/ts
  {
    files: tsconfigJsFiles,
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: { project: './tsconfig.js.json' },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // tseslint does not autodetect commonjs context
    },
  },
  {
    files: tsconfigTsFiles,
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: { project: './tsconfig.ts.json' },
    },
  },
  prettier, // Do Prettier last so it can override previous configs.

  // Customise rules.
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.{ts,mts,cts}'],
    rules: {
      'no-else-return': ['error', { allowElseIf: false }],

      // 'jsdoc/tag-lines': 'off',
      // 'jsdoc/require-jsdoc': 'off',
      // 'jsdoc/require-param-description': 'off',
      // 'jsdoc/require-returns-description': 'off',
      // 'jsdoc/require-param': ['warn', { exemptedBy: ['private'] }],
      // // Currently can not configure checking to allow return/returns (and don't want wide change mixed with more interesting fixes),
      // // and can not set options.jsdoc.mode yet to allow @remarks in typescript.
      // 'jsdoc/check-tag-names': 0,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.test.{js,mjs,cjs}'],
    rules: {
      'no-unused-vars': 'off', // lots in tests, minimise churn for now
    },
  },
  {
    files: [...tsconfigTsFiles, ...tsconfigJsFiles],
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': true,
          'ts-check': true,
        },
      ],
    },
  },
);
