#!/usr/bin/env python3
"""
Test script for the Lambda function to verify it works correctly.
"""

from lambda_function import lambda_handler
import json

def test_lambda_function():
    """Test various scenarios for the Lambda function"""
    
    print("Testing Lambda Function Web Application")
    print("=" * 50)
    
    # Test 1: No parameters (should return Page 1)
    print("\n1. Testing without parameters:")
    event1 = {'queryStringParameters': None}
    result1 = lambda_handler(event1, None)
    print(f"Status Code: {result1['statusCode']}")
    print(f"Content-Type: {result1['headers']['Content-Type']}")
    print(f"Body contains 'Page 1': {'Page 1' in result1['body']}")
    
    # Test 2: Page parameter
    print("\n2. Testing with page=2:")
    event2 = {'queryStringParameters': {'page': '2'}}
    result2 = lambda_handler(event2, None)
    print(f"Status Code: {result2['statusCode']}")
    print(f"Body contains 'Page 2': {'Page 2' in result2['body']}")
    
    # Test 3: Page parameter with value
    print("\n3. Testing with page=3 and value=test:")
    event3 = {'queryStringParameters': {'page': '3', 'value': 'test'}}
    result3 = lambda_handler(event3, None)
    print(f"Status Code: {result3['statusCode']}")
    print(f"Body contains 'Page 3': {'Page 3' in result3['body']}")
    print(f"Body contains 'value=\"test\"': {'value=\"test\"' in result3['body']}")
    
    # Test 4: Error page
    print("\n4. Testing error page:")
    event4 = {'queryStringParameters': {'page': 'error'}}
    result4 = lambda_handler(event4, None)
    print(f"Status Code: {result4['statusCode']}")
    print(f"Body contains 'Error': {'Error' in result4['body']}")
    print(f"Body contains 'Invalid Input': {'Invalid Input' in result4['body']}")
    
    # Test 5: Invalid page (should default to Page 1)
    print("\n5. Testing invalid page:")
    event5 = {'queryStringParameters': {'page': '999'}}
    result5 = lambda_handler(event5, None)
    print(f"Status Code: {result5['statusCode']}")
    print(f"Body contains 'Page 1': {'Page 1' in result5['body']}")
    
    # Test 6: Only value parameter
    print("\n6. Testing with only value parameter:")
    event6 = {'queryStringParameters': {'value': 'YES'}}
    result6 = lambda_handler(event6, None)
    print(f"Status Code: {result6['statusCode']}")
    print(f"Body contains 'Page 1': {'Page 1' in result6['body']}")
    print(f"Body contains 'value=\"YES\"': {'value=\"YES\"' in result6['body']}")
    
    print("\n" + "=" * 50)
    print("All tests completed!")

if __name__ == "__main__":
    test_lambda_function()
