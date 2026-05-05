


# Lambda Web Application UI Testing

This document describes the UI test automation for the Lambda web application using Playwright.

## Test Scenario

The main test scenario validates the following user journey:

1. **Page 1**: Enter "YES" in the input field and submit
2. **Page 2**: Enter "NO" in the input field and submit  
3. **Error Page**: Verify error message and return to Page 1

## Test Files

- `tests/lambda-webapp.spec.js` - Main test file with comprehensive scenarios
- `playwright.config.lambda.js` - Playwright configuration for Lambda testing
- `tests/global-setup.js` - Global test setup
- `tests/global-teardown.js` - Global test teardown
- `run-lambda-tests.js` - Custom test runner script

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run Tests

**Option A: Using npm scripts**
```bash
# Run tests headless (default)
npm run test:lambda

# Run tests with browser UI visible
npm run test:lambda:headed

# Run tests in Playwright UI mode (interactive)
npm run test:lambda:ui

# Run tests in debug mode
npm run test:lambda:debug
```

**Option B: Using the custom test runner**
```bash
# Headless mode
node run-lambda-tests.js

# With browser UI
node run-lambda-tests.js --headed

# Debug mode
node run-lambda-tests.js --debug

# Interactive UI mode
node run-lambda-tests.js --ui
```

### 3. View Test Results
```bash
# View HTML report
npm run report:lambda

# Or open directly
open lambda-test-results/index.html
```

## Test Coverage

### Main Test Scenarios

1. **Complete User Journey**
   - Navigate to Page 1
   - Enter "YES" and submit
   - Verify transition to Page 2
   - Enter "NO" and submit
   - Verify error page display
   - Return to Page 1

2. **Detailed Step-by-Step Validation**
   - Validates each page state
   - Checks navigation links
   - Verifies form validation
   - Tests URL parameters

3. **Navigation and URL Parameters**
   - Direct navigation to specific pages
   - URL parameter handling
   - Navigation link functionality

4. **Form Validation and Error Handling**
   - Empty form submission
   - Case sensitivity testing
   - Required field validation

5. **Visual Testing with Screenshots**
   - Captures screenshots at each step
   - Useful for visual regression testing

### Test Assertions

- ✅ Page titles and headings
- ✅ Form input values
- ✅ URL parameters
- ✅ Navigation state
- ✅ Error messages
- ✅ Button functionality
- ✅ Page transitions

## Configuration

### Browser Support
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

### Test Settings
- **Base URL**: `http://localhost:8000`
- **Timeout**: 10 seconds per action
- **Retries**: 1 retry on failure
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

### Local Server
The tests automatically start the local Lambda server (`local_server.py`) before running tests and stop it afterward.

## Debugging

### Debug Mode
```bash
npm run test:lambda:debug
```
This will:
- Run tests with browser UI visible
- Pause execution for manual inspection
- Allow step-by-step debugging

### Playwright UI Mode
```bash
npm run test:lambda:ui
```
This provides:
- Interactive test runner
- Time travel debugging
- Test editing capabilities
- Real-time test execution

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots: `test-results/`
- Videos: `test-results/`
- Traces: Available in HTML report

## Troubleshooting

### Common Issues

1. **Server not starting**
   ```bash
   # Manually start the server first
   python3 local_server.py
   # Then run tests without webServer config
   ```

2. **Port already in use**
   ```bash
   # Kill existing processes on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

3. **Browser installation**
   ```bash
   # Reinstall browsers
   npx playwright install --force
   ```

4. **Test timeouts**
   - Increase timeout in `playwright.config.lambda.js`
   - Check server logs for errors

### Logs and Reports

- **Test Results**: `lambda-test-results/`
- **Screenshots**: `test-results/`
- **Server Logs**: Console output during test run
- **JSON Report**: `lambda-test-results.json`

## Extending Tests

### Adding New Test Cases
```javascript
test('your new test case', async ({ page }) => {
  await page.goto('/');
  // Your test logic here
});
```

### Custom Assertions
```javascript
// Add to tests/lambda-webapp.spec.js
await expect(page.locator('.custom-element')).toBeVisible();
```

### Environment Variables
```bash
# Set custom base URL
BASE_URL=https://your-lambda-url.amazonaws.com npm run test:lambda
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Lambda UI Tests
  run: |
    npm install
    npx playwright install --with-deps
    npm run test:lambda
```

### Test Reports in CI
The HTML report can be uploaded as artifacts for review in CI/CD pipelines.

## Performance Testing

The test suite includes basic performance validation:
- Page load times
- Navigation speed
- Form submission response times

## Security Testing

Basic security checks included:
- Input validation
- XSS prevention (basic)
- CSRF protection (if implemented)

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run test:lambda` | Run all Lambda tests headless |
| `npm run test:lambda:headed` | Run with browser UI |
| `npm run test:lambda:ui` | Interactive Playwright UI |
| `npm run test:lambda:debug` | Debug mode |
| `npm run report:lambda` | View HTML report |
| `node run-lambda-tests.js --headed` | Custom runner with UI |

For more details, see the [Playwright documentation](https://playwright.dev/).


