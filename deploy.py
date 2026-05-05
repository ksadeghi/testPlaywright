
#!/usr/bin/env python3
"""
Deployment script for the Lambda function.
This script creates a deployment package for AWS Lambda.
"""

import zipfile
import os

def create_deployment_package():
    """Create a ZIP file for Lambda deployment"""
    
    # Files to include in the deployment package
    files_to_include = [
        'lambda_function.py'
    ]
    
    # Create the ZIP file
    with zipfile.ZipFile('lambda_deployment.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_include:
            if os.path.exists(file):
                zipf.write(file)
                print(f"Added {file} to deployment package")
            else:
                print(f"Warning: {file} not found")
    
    print("Deployment package created: lambda_deployment.zip")
    print("File size:", os.path.getsize('lambda_deployment.zip'), "bytes")

if __name__ == "__main__":
    create_deployment_package()

