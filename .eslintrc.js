module.exports = {
  extends: [
    'plugin:wkovacs64/react',
    'plugin:wkovacs64/jest',
    'plugin:wkovacs64/typescript',
    'prettier',
  ],
  rules: {
    // doesn't work with vitest as it relies on jest version detection
    'jest/no-deprecated-functions': 'off',
  },
  parserOptions: {
    project: 'tsconfig.json',
  },
  ignorePatterns: ['vitest.config.ts'],
};
