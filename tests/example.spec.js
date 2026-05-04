

const { test, expect } = require('@playwright/test');

test.describe('Example Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    
    // Click on search
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type in search box
    await page.getByPlaceholder('Search docs').fill('test');
    
    // Verify search results appear
    await expect(page.getByText('Search results')).toBeVisible();
  });
});

test.describe('Form Testing', () => {
  test('basic form interaction', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // Add a new todo item
    await page.getByPlaceholder('What needs to be done?').fill('Learn Playwright');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    
    // Verify the todo item was added
    await expect(page.getByTestId('todo-title')).toHaveText('Learn Playwright');
    
    // Mark as completed
    await page.getByRole('checkbox').check();
    
    // Verify it's marked as completed
    await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  });
});

test.describe('API Testing', () => {
  test('API request example', async ({ request }) => {
    // Make an API request
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Verify response data
    const data = await response.json();
    expect(data.userId).toBe(1);
    expect(data.id).toBe(1);
    expect(data.title).toBeTruthy();
  });
});


