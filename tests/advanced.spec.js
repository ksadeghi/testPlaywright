


const { test, expect } = require('@playwright/test');

test.describe('Advanced Playwright Features', () => {
  test('screenshot comparison', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('network interception', async ({ page }) => {
    // Intercept network requests
    await page.route('**/api/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ])
      });
    });

    await page.goto('https://reqres.in/');
    
    // Trigger API call and verify mocked response
    await page.getByText('List Users').click();
  });

  test('file upload', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    // Create a test file
    const fileContent = 'This is a test file for upload';
    
    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(fileContent)
    });
    
    await page.getByRole('button', { name: 'Upload' }).click();
    
    // Verify upload success
    await expect(page.getByText('File Uploaded!')).toBeVisible();
  });

  test('drag and drop', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
    
    // Get source and target elements
    const source = page.locator('#column-a');
    const target = page.locator('#column-b');
    
    // Perform drag and drop
    await source.dragTo(target);
    
    // Verify the elements have switched positions
    await expect(page.locator('#column-a header')).toHaveText('B');
    await expect(page.locator('#column-b header')).toHaveText('A');
  });

  test('multiple tabs handling', async ({ context }) => {
    // Create a new page (tab)
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev/');
    
    // Create another page (tab)
    const page2 = await context.newPage();
    await page2.goto('https://github.com/microsoft/playwright');
    
    // Verify both pages are loaded correctly
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/GitHub/);
    
    // Switch between tabs and perform actions
    await page1.bringToFront();
    await page1.getByRole('link', { name: 'Get started' }).click();
    
    await page2.bringToFront();
    await page2.getByRole('button', { name: 'Star' }).click();
  });

  test('geolocation testing', async ({ context, page }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);
    
    // Set geolocation
    await context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });
    
    await page.goto('https://maps.google.com');
    
    // Click on location button (this would normally request location)
    // Note: This is just an example, actual implementation may vary
    await page.waitForTimeout(2000);
  });

  test('local storage manipulation', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // Add some todos
    await page.getByPlaceholder('What needs to be done?').fill('Task 1');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    
    await page.getByPlaceholder('What needs to be done?').fill('Task 2');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    
    // Get local storage data
    const todos = await page.evaluate(() => {
      return localStorage.getItem('todos-vanillajs');
    });
    
    expect(todos).toBeTruthy();
    
    // Clear local storage
    await page.evaluate(() => localStorage.clear());
    
    // Reload and verify todos are gone
    await page.reload();
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });
});

test.describe('Performance Testing', () => {
  test('page load performance', async ({ page }) => {
    // Start measuring performance
    await page.goto('https://playwright.dev/');
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    // Assert performance thresholds
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3 seconds
    expect(performanceMetrics.loadComplete).toBeLessThan(5000); // 5 seconds
    
    console.log('Performance Metrics:', performanceMetrics);
  });
});



