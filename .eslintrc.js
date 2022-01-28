const javascriptSettings = {
  files: ['*.js', '*.mjs'],
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'space-before-function-paren': ['error', 'never'],
    // manual "semistandard" settings
    semi: ['error', 'always'],
    'no-extra-semi': 'error'
  }
};

const typescriptSettings = {
  files: ['*.ts'],
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'standard-with-typescript'
  ],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
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
    ],
    // manual "semistandard" settings
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': ['error']
  }
};

module.exports = {
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 8
  },
  overrides: [
    javascriptSettings,
    typescriptSettings,
    {
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module'
      }
    }
  ]
};
