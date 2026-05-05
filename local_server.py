
#!/usr/bin/env python3
"""
Local development server to test the Lambda function locally.
This simulates how the Lambda function would work when deployed.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from lambda_function import lambda_handler

class LambdaHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests by simulating Lambda function execution"""
        
        # Parse the URL and query parameters
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        
        # Convert query parameters to Lambda event format
        lambda_query_params = {}
        for key, values in query_params.items():
            lambda_query_params[key] = values[0] if values else ''
        
        # Create Lambda event
        event = {
            'queryStringParameters': lambda_query_params if lambda_query_params else None
        }
        
        # Call the Lambda function
        try:
            result = lambda_handler(event, None)
            
            # Send response
            self.send_response(result['statusCode'])
            
            # Send headers
            for header, value in result['headers'].items():
                self.send_header(header, value)
            self.end_headers()
            
            # Send body
            self.wfile.write(result['body'].encode('utf-8'))
            
        except Exception as e:
            # Handle errors
            self.send_response(500)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            error_html = f"""
            <html>
                <body>
                    <h1>Server Error</h1>
                    <p>Error: {str(e)}</p>
                </body>
            </html>
            """
            self.wfile.write(error_html.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom log message to show requests"""
        print(f"[{self.date_time_string()}] {format % args}")

def run_server(port=8000):
    """Run the local development server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, LambdaHandler)
    
    print(f"Starting local development server on port {port}")
    print(f"Visit: http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()

