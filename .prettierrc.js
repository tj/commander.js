export default {
  singleQuote: true,
  overrides: [
    {
      files: ['tsconfig*.json'],
      options: { parser: 'jsonc' },
    },
  ],
};
