const config = {
  // plugins: ['prettier-plugin-jsdoc'],
  singleQuote: true,
  overrides: [
    {
      files: ['tsconfig*.json'],
      options: { parser: 'jsonc' },
    },
  ],
};

module.exports = config;
