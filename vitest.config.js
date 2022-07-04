// TODO: figure out why eslint cannot resolve 'vitest/config'
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'lcov', 'clover'],
    },
    globals: true,
    environment: 'node',
  },
});
