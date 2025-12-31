export default {
  testEnvironment: 'node',
  collectCoverage: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.ts.json', useESM: true }],
  },
  testPathIgnorePatterns: ['/node_modules/'],
};
