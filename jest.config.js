const config = {
  testEnvironment: 'node',
  collectCoverage: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};

module.exports = config;
