import json
import urllib.parse

def lambda_handler(event, context):
    """
    Lambda function that serves a simple web application with 3 pages.
    - Without parameters: returns HTML interface
    - With parameters: loads page with provided value
    """
    
    # Get query parameters
    query_params = event.get('queryStringParameters') or {}
    page = query_params.get('page', '1')
    value = query_params.get('value', '')
    
    # Determine which page to serve
    if not query_params:
        # No parameters - serve the first page
        html_content = get_page_html('1', '')
    elif 'page' in query_params:
        # Page parameter provided
        if page in ['1', '2', '3']:
            html_content = get_page_html(page, value)
        elif page == 'error':
            html_content = get_error_page()
        else:
            html_content = get_page_html('1', '')
    else:
        # Other parameters - serve first page
        html_content = get_page_html('1', value)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': html_content
    }

def get_page_html(page_num, prefill_value=''):
    """Generate HTML for a specific page"""
    
    base_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple Web Application - Page {page_num}</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .container {{
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            h1 {{
                color: #333;
                text-align: center;
            }}
            .form-group {{
                margin: 20px 0;
            }}
            label {{
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }}
            input[type="text"] {{
                width: 100%;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                box-sizing: border-box;
            }}
            button {{
                background-color: #007bff;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                margin-right: 10px;
            }}
            button:hover {{
                background-color: #0056b3;
            }}
            .navigation {{
                text-align: center;
                margin: 20px 0;
            }}
            .nav-link {{
                color: #007bff;
                text-decoration: none;
                margin: 0 10px;
                padding: 5px 10px;
                border: 1px solid #007bff;
                border-radius: 3px;
            }}
            .nav-link:hover {{
                background-color: #007bff;
                color: white;
            }}
            .current-page {{
                background-color: #007bff;
                color: white;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Simple Web Application</h1>
            <h2>Page {page_num}</h2>
            
            <div class="navigation">
                <a href="?page=1" class="nav-link {'current-page' if page_num == '1' else ''}">Page 1</a>
                <a href="?page=2" class="nav-link {'current-page' if page_num == '2' else ''}">Page 2</a>
                <a href="?page=3" class="nav-link {'current-page' if page_num == '3' else ''}">Page 3</a>
            </div>
            
            <form id="pageForm" onsubmit="handleSubmit(event)">
                <div class="form-group">
                    <label for="userInput">Enter a value (type "YES" to proceed):</label>
                    <input type="text" id="userInput" name="userInput" value="{prefill_value}" required>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
        
        <script>
            function handleSubmit(event) {{
                event.preventDefault();
                const input = document.getElementById('userInput').value.trim();
                const currentPage = '{page_num}';
                
                if (input.toUpperCase() === 'YES') {{
                    // Move to next page or back to page 1 if on page 3
                    let nextPage = parseInt(currentPage) + 1;
                    if (nextPage > 3) {{
                        nextPage = 1;
                    }}
                    window.location.href = `?page=${{nextPage}}&value=${{encodeURIComponent(input)}}`;
                }} else {{
                    // Go to error page
                    window.location.href = `?page=error&value=${{encodeURIComponent(input)}}`;
                }}
            }}
        </script>
    </body>
    </html>
    """
    
    return base_html

def get_error_page():
    """Generate HTML for the error page"""
    
    error_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            h1 {
                color: #dc3545;
            }
            .error-message {
                color: #721c24;
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            button {
                background-color: #007bff;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>❌ Error</h1>
            <div class="error-message">
                <strong>Invalid Input!</strong><br>
                You must enter "YES" to proceed. Please try again.
            </div>
            <a href="?page=1" style="text-decoration: none;">
                <button>Back to Page 1</button>
            </a>
        </div>
    </body>
    </html>
    """
    
    return error_html
