import { fileURLToPath } from 'node:url';
import type { UserConfig } from 'vite';
import { mergeConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

const typedViteConfig = viteConfig as UserConfig;

export default mergeConfig(
  typedViteConfig,
  {
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        enabled: true,
        reporter: ['html', 'text-summary', 'json'],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 65,
          statements: 70
        }
      }
    }
  }
);
