import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const externalPackages = ['react', 'react-dom', 'tailwindcss'];

// 外部依赖判定集中维护，避免把 React、Tailwind 或 Radix 底座打进组件库产物。
const isExternalDependency = (id: string) =>
  externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`)) || id.startsWith('@radix-ui/');

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.stories.ts',
        'src/**/*.stories.tsx',
        'src/test/**/*',
        '.storybook/**/*',
      ],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EtlChinaUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: isExternalDependency,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
