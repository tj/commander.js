const globals = require("globals");
const esLintjs = require("@eslint/js");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

// Jest is in process of updating for flat config support, so mixture of approaches.
// https://github.com/jest-community/eslint-plugin-jest/issues/1408

module.exports = [
  esLintjs.configs.recommended,
  prettier,
  {
    files: ["**/*.js", "**/*.mjs", "*.cjs", "**/*.ts", "**/*.mts", "*.cts"],
    rules: {
      "no-unused-vars": "off", // lots in tests, minimise churn to start with
      'no-else-return': ['error', { allowElseIf: false }],
    },
    languageOptions: {
      globals: {
        ...globals.node,
      }
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
  {
    files: ["**/*.js"],
    languageOptions: {
        sourceType: "commonjs"
    }
  }
];
