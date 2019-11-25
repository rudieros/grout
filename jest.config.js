const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
  transform: {
    ...tsjPreset.transform,
  },
  setupFiles: ['./jest/setup.js'],
  // globalSetup: './jest/globalJestSetup.ts',
  // globalTeardown: './jest/globalJestTeardown.ts',
}
