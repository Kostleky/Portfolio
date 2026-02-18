// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.js'],
      exclude: [
        'test/**',
        'node_modules/**',
        'coverage/**',
        '*.config.js',
        'src/index.js',
        'src/config/database.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
})
