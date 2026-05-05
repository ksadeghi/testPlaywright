
const { test, expect } = require('@playwright/test');

test.describe('Lambda Web Application UI Tests', () => {
  let baseURL;

  test.beforeAll(async () => {
    // You can set this to your Lambda function URL when deployed
    // For local testing, we'll use localhost
    baseURL = 'http://localhost:8000';
  });

  test('Scenario: Enter YES on Page 1, then NO on Page 2', async ({ page }) => {
    // Navigate to the web application
    await page.goto(baseURL);

    // Verify we're on Page 1
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
    await expect(page.locator('.current-page')).toContainText('Page 1');

    // Enter "YES" in the input field on Page 1
    await page.getByLabel('Enter a value (type "YES" to proceed):').fill('YES');
    
    // Verify the input value
    await expect(page.getByLabel('Enter a value (type "YES" to proceed):')).toHaveValue('YES');

    // Click Submit button
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify we're now on Page 2
    await expect(page.getByRole('heading', { name: 'Page 2' })).toBeVisible();
    await expect(page.locator('.current-page')).toContainText('Page 2');
    
    // Verify the URL contains page=2 and value=YES
    expect(page.url()).toContain('page=2');
    expect(page.url()).toContain('value=YES');

    // Verify the input field is pre-filled with "YES" from previous page
    await expect(page.getByLabel('Enter a value (type "YES" to proceed):')).toHaveValue('YES');

    // Clear the input and enter "NO" on Page 2
    await page.getByLabel('Enter a value (type "YES" to proceed):').clear();
    await page.getByLabel('Enter a value (type "YES" to proceed):').fill('NO');
    
    // Verify the input value is "NO"
    await expect(page.getByLabel('Enter a value (type "YES" to proceed):')).toHaveValue('NO');

    // Click Submit button
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify we're redirected to the error page
    await expect(page.getByRole('heading', { name: '❌ Error' })).toBeVisible();
    await expect(page.getByText('Invalid Input!')).toBeVisible();
    await expect(page.getByText('You must enter "YES" to proceed. Please try again.')).toBeVisible();
    
    // Verify the URL contains page=error and value=NO
    expect(page.url()).toContain('page=error');
    expect(page.url()).toContain('value=NO');

    // Verify the "Back to Page 1" button is present
    await expect(page.getByRole('button', { name: 'Back to Page 1' })).toBeVisible();

    // Click "Back to Page 1" button
    await page.getByRole('button', { name: 'Back to Page 1' }).click();

    // Verify we're back on Page 1
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
    await expect(page.locator('.current-page')).toContainText('Page 1');
  });

  test('Detailed step-by-step validation', async ({ page }) => {
    // Step 1: Navigate to application
    await page.goto(baseURL);
    
    // Step 2: Validate Page 1 initial state
    await expect(page.getByRole('heading', { name: 'Simple Web Application' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
    
    // Verify navigation links are present
    await expect(page.getByRole('link', { name: 'Page 1' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Page 2' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Page 3' })).toBeVisible();
    
    // Verify input field is empty initially
    const inputField = page.getByLabel('Enter a value (type "YES" to proceed):');
    await expect(inputField).toBeEmpty();
    await expect(inputField).toHaveAttribute('required');

    // Step 3: Enter "YES" on Page 1
    await inputField.fill('YES');
    await expect(inputField).toHaveValue('YES');

    // Step 4: Submit and verify transition to Page 2
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for navigation and verify Page 2
    await page.waitForURL('**/page=2**');
    await expect(page.getByRole('heading', { name: 'Page 2' })).toBeVisible();
    
    // Step 5: Verify Page 2 state
    const page2Input = page.getByLabel('Enter a value (type "YES" to proceed):');
    await expect(page2Input).toHaveValue('YES'); // Should be pre-filled
    
    // Verify Page 2 is highlighted in navigation
    await expect(page.locator('a[href="?page=2"]')).toHaveClass(/current-page/);

    // Step 6: Enter "NO" on Page 2
    await page2Input.clear();
    await page2Input.fill('NO');
    await expect(page2Input).toHaveValue('NO');

    // Step 7: Submit and verify error page
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for navigation to error page
    await page.waitForURL('**/page=error**');
    
    // Step 8: Validate error page content
    await expect(page.getByRole('heading', { name: '❌ Error' })).toBeVisible();
    
    // Verify error message styling and content
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid Input!');
    await expect(errorMessage).toContainText('You must enter "YES" to proceed');
    
    // Step 9: Return to Page 1
    await page.getByRole('link', { name: 'Back to Page 1' }).click();
    await page.waitForURL('**/page=1**');
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
  });

  test('Navigation and URL parameter validation', async ({ page }) => {
    // Test direct navigation to Page 2 with pre-filled value
    await page.goto(`${baseURL}?page=2&value=TEST`);
    
    // Verify Page 2 loads with pre-filled value
    await expect(page.getByRole('heading', { name: 'Page 2' })).toBeVisible();
    await expect(page.getByLabel('Enter a value (type "YES" to proceed):')).toHaveValue('TEST');
    
    // Test navigation links
    await page.getByRole('link', { name: 'Page 1' }).click();
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
    
    await page.getByRole('link', { name: 'Page 3' }).click();
    await expect(page.getByRole('heading', { name: 'Page 3' })).toBeVisible();
  });

  test('Form validation and error handling', async ({ page }) => {
    await page.goto(baseURL);
    
    // Test empty form submission (should be prevented by required attribute)
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const inputField = page.getByLabel('Enter a value (type "YES" to proceed):');
    
    // Try to submit empty form
    await submitButton.click();
    
    // Verify we're still on Page 1 (form validation should prevent submission)
    await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
    
    // Test case sensitivity - "yes" (lowercase) should still work
    await inputField.fill('yes');
    await submitButton.click();
    
    // Should navigate to Page 2 (case insensitive)
    await expect(page.getByRole('heading', { name: 'Page 2' })).toBeVisible();
  });

  test('Complete user journey with screenshots', async ({ page }) => {
    // Take screenshot of initial state
    await page.goto(baseURL);
    await page.screenshot({ path: 'test-results/01-page1-initial.png', fullPage: true });
    
    // Fill YES and take screenshot
    await page.getByLabel('Enter a value (type "YES" to proceed):').fill('YES');
    await page.screenshot({ path: 'test-results/02-page1-filled.png', fullPage: true });
    
    // Submit and screenshot Page 2
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.screenshot({ path: 'test-results/03-page2-loaded.png', fullPage: true });
    
    // Fill NO and take screenshot
    await page.getByLabel('Enter a value (type "YES" to proceed):').clear();
    await page.getByLabel('Enter a value (type "YES" to proceed):').fill('NO');
    await page.screenshot({ path: 'test-results/04-page2-filled-no.png', fullPage: true });
    
    // Submit and screenshot error page
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.screenshot({ path: 'test-results/05-error-page.png', fullPage: true });
    
    // Final verification
    await expect(page.getByRole('heading', { name: '❌ Error' })).toBeVisible();
  });
});

