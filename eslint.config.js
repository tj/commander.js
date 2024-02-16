const globals = require('globals');
const esLintjs = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const prettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');
// const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
  esLintjs.configs.recommended,
  // jsdoc.configs['flat/recommended'],
  jest.configs['flat/recommended'],
  // Restricting TypeScript configs to TypeScript files.
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    languageOptions: {parser: tseslint.parser, parserOptions: { project: './tsconfig.ts.json' }},
    files: ['**/*.{ts,mts,cts}'],
  })),
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.{ts,mts,cts}'],
    rules: {
      'no-unused-vars': 'off', // lots in tests, minimise churn for now
      'no-else-return': ['error', { allowElseIf: false }],
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier, // Do Prettier last so it can override previous configs.
];
