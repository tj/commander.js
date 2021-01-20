const javascriptSettings = {
  files: ['*.js', '*.mjs'],
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
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'no-var': 'warn',
    'one-var': 'off',
    'space-before-function-paren': ['error', 'never'],
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
    ],
    // Add some "standard" rules by hand, as eslint-config-standard-with-typescript painful to keep up to date
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error'
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
