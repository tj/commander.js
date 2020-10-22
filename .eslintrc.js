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
  }
};

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
    // Using method rather than property for method-signature-style, to document method overloads separately.
    '@typescript-eslint/method-signature-style': ['warn', 'method'],
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
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
};

module.exports = {
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 8
  },
  overrides: [
    javascriptSettings,
    typescriptSettings
  ]
};
