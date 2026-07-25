import globals from 'globals';
import esLintjs from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import nodeTest from 'eslint-node-test';

// Only run tseslint on the files that we have included for TypeScript.
const tsconfigTsFiles = ['**/*.{ts,mts}']; // match "include" in tsconfig.ts.json;
const tsconfigJsFiles = ['*.{js,mjs}', 'lib/**/*.{js,mjs}']; // match "include" in tsconfig.js.json

// Using tseslint.config adds some type safety and `extends` to simplify customising config array.
export default defineConfig(
  // Add recommended rules.
  esLintjs.configs.recommended,
  // tseslint with different setup for js/ts
  {
    files: tsconfigJsFiles,
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: { project: './tsconfig.js.json' },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // tseslint does not autodetect commonjs context
      '@typescript-eslint/no-require-imports': 'off', // tseslint does not autodetect commonjs context
    },
  },
  {
    files: tsconfigTsFiles,
    extends: [tseslint.configs.recommended],
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
  {
    files: ['**/*.js'],
    plugins: {
      'node-test': nodeTest,
    },
    extends: ['node-test/recommended'],
    rules: {
      'node-test/no-constant-assertion': 'off', // getting false positives, opened issue, disable for now
      'node-test/prefer-test-context-assert': 'off', // use callback parameter t to access mock, but do not want to change assert
      'node-test/no-useless-assertion': 'off', // use `assert.doesNotThrow()` as only assert in multiple tests (and get another error if no asserts)
      'node-test/no-process-env-mutation': 'off', // going to revisit...
    },
  },
);
