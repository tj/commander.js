const javascriptSettings = {
  files: ['*.js'],
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'no-var': 'warn',
    'one-var': 'off',
    'space-before-function-paren': ['error', 'never'],
    semi: ['error', 'always']
  },
}

const typescriptSettings = {
  files: ['*.ts'],
  extends: ['standard-with-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'no-var': 'warn',
    'one-var': 'off',
    'space-before-function-paren': ['error', 'never'],
    semi: ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ]
  }
}

module.exports = {
  plugins: ['jest'],
  overrides: [
    javascriptSettings,
    typescriptSettings
  ]
}
