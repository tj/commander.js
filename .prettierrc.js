const config = {
  singleQuote: true,
  overrides: [
    {
      files: ['tsconfig*.json'],
      options: { parser: 'jsonc' },
    },
  ],
};

module.exports = config;
