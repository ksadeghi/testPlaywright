
# Development Workspace

This workspace contains multiple projects:

## 1. Lambda Function Web Application

A simple AWS Lambda function that serves a web application with 3 pages through a Lambda Function URL endpoint.

## 2. Playwright Testing Project

A comprehensive Playwright testing project with examples and advanced features.

## Features

- **3-Page Web Application**: Navigate between Page 1, Page 2, and Page 3
- **Input Validation**: Each page has an input field that requires "YES" to proceed
- **Error Handling**: Invalid inputs redirect to an error page
- **Parameter Support**: Can load pages with pre-filled values via URL parameters
- **Responsive Design**: Clean, modern UI that works on desktop and mobile

## How It Works

### Without Parameters
When you invoke the endpoint without parameters, it returns the HTML interface starting with Page 1.

### With Parameters
- `?page=1` - Loads Page 1
- `?page=2` - Loads Page 2  
- `?page=3` - Loads Page 3
- `?page=error` - Loads the error page
- `?value=something` - Pre-fills the input field with the provided value

### User Flow
1. User enters a value in the input field
2. If value is "YES" (case-insensitive), user proceeds to the next page
3. If value is anything else, user is redirected to an error page
4. From Page 3, "YES" takes you back to Page 1 (circular navigation)

## Files

- `lambda_function.py` - Main Lambda function code
- `requirements.txt` - Dependencies (none required for this project)
- `deploy.py` - Script to create deployment package
- `README.md` - This documentation file

## Deployment Instructions

### Step 1: Create Deployment Package
```bash
python3 deploy.py
```
This creates `lambda_deployment.zip` containing the Lambda function code.

### Step 2: Create Lambda Function in AWS Console

1. **Go to AWS Lambda Console**
   - Navigate to https://console.aws.amazon.com/lambda/

2. **Create Function**
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `simple-web-app`
   - Runtime: `Python 3.9` (or later)
   - Click "Create function"

3. **Upload Code**
   - In the function overview, click "Upload from" → ".zip file"
   - Upload the `lambda_deployment.zip` file
   - Click "Save"

4. **Configure Function**
   - Handler: `lambda_function.lambda_handler` (should be default)
   - Timeout: 30 seconds (recommended)
   - Memory: 128 MB (sufficient for this application)

### Step 3: Create Function URL

1. **In the Lambda function console:**
   - Go to the "Configuration" tab
   - Click "Function URL" in the left sidebar
   - Click "Create function URL"

2. **Configure Function URL:**
   - Auth type: `NONE` (for public access)
   - Configure CORS:
     - Allow origin: `*`
     - Allow methods: `GET, POST, OPTIONS`
     - Allow headers: `Content-Type`
   - Click "Save"

3. **Copy the Function URL**
   - The URL will look like: `https://abc123def456.lambda-url.us-east-1.on.aws/`

### Step 4: Test the Application

Visit your Function URL in a browser. You should see:
- Page 1 with an input field
- Navigation links to Pages 1, 2, and 3
- Submit button that validates input

## Testing Examples

### Basic Usage
```
https://your-function-url.lambda-url.region.on.aws/
```

### With Parameters
```
https://your-function-url.lambda-url.region.on.aws/?page=2
https://your-function-url.lambda-url.region.on.aws/?page=3&value=test
https://your-function-url.lambda-url.region.on.aws/?value=YES
```

## Local Testing

To test the Lambda function locally, you can create a simple test script:

```python
from lambda_function import lambda_handler

# Test without parameters
event1 = {'queryStringParameters': None}
result1 = lambda_handler(event1, None)
print("Status:", result1['statusCode'])

# Test with page parameter
event2 = {'queryStringParameters': {'page': '2'}}
result2 = lambda_handler(event2, None)
print("Status:", result2['statusCode'])

# Test with value parameter
event3 = {'queryStringParameters': {'page': '1', 'value': 'test'}}
result3 = lambda_handler(event3, None)
print("Status:", result3['statusCode'])
```

## Security Considerations

- The function URL is configured for public access (`NONE` auth type)
- Input validation is performed on the client side and server side
- No sensitive data is stored or processed
- CORS is enabled for web browser compatibility

## Customization

You can easily customize the application by modifying:
- **Styling**: Update the CSS in the `<style>` sections
- **Validation Logic**: Modify the input validation in `handleSubmit()` function
- **Page Content**: Add more content to each page in the `get_page_html()` function
- **Navigation**: Change the page flow logic in the JavaScript

## Troubleshooting

### Common Issues

1. **Function URL not working**
   - Ensure the Function URL is created and configured correctly
   - Check that auth type is set to `NONE` for public access

2. **CORS errors**
   - Verify CORS settings in the Function URL configuration
   - Ensure the Lambda function returns proper CORS headers

3. **Page not loading**
   - Check CloudWatch logs for any errors
   - Verify the handler is set to `lambda_function.lambda_handler`

### CloudWatch Logs
Monitor your function's execution in CloudWatch Logs:
- Go to CloudWatch → Log groups
- Find `/aws/lambda/simple-web-app`
- View recent log streams for debugging

## Cost Estimation

This Lambda function is very cost-effective:
- **Requests**: First 1M requests per month are free
- **Compute**: Minimal compute time (< 100ms per request)
- **Data Transfer**: Minimal data transfer costs

For typical usage, this should fall well within AWS Free Tier limits.

