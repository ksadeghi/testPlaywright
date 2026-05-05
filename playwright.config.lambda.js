

// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuration specifically for Lambda Web Application UI Testing
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Only run lambda webapp tests */
  testMatch: '**/lambda-webapp.spec.js',
  /* Run tests in files in parallel */
  fullyParallel: false, // Sequential for better debugging
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests for lambda testing */
  workers: 1,
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'lambda-test-results' }],
    ['list'],
    ['json', { outputFile: 'lambda-test-results.json' }]
  ],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL for Lambda web application */
    baseURL: 'http://localhost:8000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Timeout for each action */
    actionTimeout: 10000,
    
    /* Timeout for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],

  /* Run your local Lambda server before starting the tests */
  webServer: {
    command: 'python3 local_server.py',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),

  /* Output directories */
  outputDir: 'test-results/',
  
  /* Expect options */
  expect: {
    /* Timeout for expect assertions */
    timeout: 10000,
  },
});


