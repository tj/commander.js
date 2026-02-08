// List the dependencies that are pure esm and need transformation.
const esmModules = ['commander'].join('|'); // redundant join in case you have others

module.exports = {
  // 1. tell ts-jest to (also) handle .js and .mjs files
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: false, // want CJS for Jest
      },
    ],
  },
  // 2. allow transformation of specific node_modules
  transformIgnorePatterns: [`node_modules/(?!(${esmModules})/)`],
};
