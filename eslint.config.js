const globals = require('globals');
const esLintjs = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
//const jsdoc = require('eslint-plugin-jsdoc');

// Using tseslint config helper to customise its setup the tseslint way.
const tsconfigTsFiles = ['**/*.{ts,mts}']; // match "include" in tsconfig.ts.json;
const tsconfigJsFiles = ['*.{js,mjs}', 'lib/**/*.{js,mjs}']; // match "include" in tsconfig.js.json
const tseslintConfigs = tseslint.config(
  {
    files: tsconfigJsFiles,
    languageOptions: {
      parserOptions: { project: './tsconfig.js.json' },
    },
    extends: [
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // (tseslint does not autodetect commonjs context )
    },
  }, {
    files: tsconfigTsFiles,
    languageOptions: {
      parserOptions: { project: './tsconfig.ts.json' },
    },
    extends: [
      ...tseslint.configs.recommended,
    ],
  },
);

module.exports = [
  esLintjs.configs.recommended,
  // jsdoc.configs['flat/recommended'],
  jest.configs['flat/recommended'],
  ...tseslintConfigs,
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
    }
  },
  {
    files: [...tsconfigTsFiles, ...tsconfigJsFiles],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': true,
        'ts-check': true,
    }],
    },
  },
];
