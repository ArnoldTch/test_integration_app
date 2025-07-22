module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: ['**/tests/**/*.spec.js'],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.cjs.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};