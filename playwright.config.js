import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const PORT = Number(process.env.PORT) || 8000;

// Keep local readiness checks off corporate proxies without losing existing exclusions.
// Set both spellings because proxy clients may prefer the lowercase variable.
const noProxy = [...new Set([
  ...(process.env.NO_PROXY || '').split(','),
  ...(process.env.no_proxy || '').split(','),
  'localhost', '127.0.0.1', '::1', '[::1]'
].map((host) => host.trim()).filter(Boolean))].join(',');
process.env.NO_PROXY = noProxy;
process.env.no_proxy = noProxy;

const testDir = defineBddConfig({
  features: 'tests/e2e/features/**/*.feature',
  steps: 'tests/e2e/steps/**/*.js',
  outputDir: 'tests/e2e/.features-gen'
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The JSON results are the input for the deterministic test report (test-report skill).
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/e2e-results.json' }]
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } }
  ],
  webServer: {
    command: 'node tests/support/static-server.mjs',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) }
  }
});
