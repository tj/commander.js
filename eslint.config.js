const globals = require('globals');
const esLintjs = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const prettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');


// const jsdoc = require('eslint-plugin-jsdoc');
const { FlatCompat } = require('@eslint/eslintrc'); // For reading original (non-flat) configs into flat format.

// Jest is in process of updating for flat config support, so mixture of approaches.
// https://github.com/jest-community/eslint-plugin-jest/issues/1408

module.exports = [
  esLintjs.configs.recommended,
  // jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.{ts,mts,cts}'],
    rules: {
      'no-unused-vars': 'off', // lots in tests, minimise churn to start with
      'no-else-return': ['error', { allowElseIf: false }],
      // 'jsdoc/tag-lines': 'off',
      // 'jsdoc/require-jsdoc': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // Restricting TypeScript configs to TypeScript files.
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: ['**/*.{ts,mts,cts}'],
  })),
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.test.js'],
    plugins: {
      jest: jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  prettier,
];
