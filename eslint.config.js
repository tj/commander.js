const globals = require("globals");
const esLintjs = require("@eslint/js");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");
const jsdoc = require('eslint-plugin-jsdoc');
const { FlatCompat } = require("@eslint/eslintrc"); // For reading original (non-flat) configs into flat format.

// Jest is in process of updating for flat config support, so mixture of approaches.
// https://github.com/jest-community/eslint-plugin-jest/issues/1408

// Likewise with TypeScript, recommended approach is compatibility layer for now.
// https://github.com/typescript-eslint/typescript-eslint/issues/7694

const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

module.exports = [
  esLintjs.configs.recommended,
  // jsdoc.configs['flat/recommended'],
  {
    files: ["**/*.{js,mjs,cjs}", "**/*.{ts,mts,cts}"],
    rules: {
      "no-unused-vars": "off", // lots in tests, minimise churn to start with
      'no-else-return': ['error', { allowElseIf: false }],
      // 'jsdoc/tag-lines': ['warn', "always", {"startLines":1}]
    },
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },
  // Hack, restricting TypeScript config to TypeScript files.
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
  ).map(c => ({
    ...c,
    files: ["**/*.{ts,mts,cts}"],
  })),
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    files: ["**/*.test.js"],
    plugins: {
      jest: jest
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  prettier,
];
