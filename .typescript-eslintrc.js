module.exports = {
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'one-var': 'off',
    'no-var': 'warn',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'no-else-return': ['error', { 'allowElseIf': false }]
  }
}
