


#!/usr/bin/env node

/**
 * Test runner for Lambda Web Application UI Tests
 * Scenario: Enter YES for Page 1 and Enter NO for Page 2
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎭 Lambda Web Application UI Test Runner');
console.log('📋 Test Scenario: Enter YES on Page 1, then NO on Page 2');
console.log('=' * 60);

// Create test-results directory if it doesn't exist
const testResultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
  console.log('📁 Created test-results directory');
}

// Parse command line arguments
const args = process.argv.slice(2);
const isHeaded = args.includes('--headed');
const isDebug = args.includes('--debug');
const isUI = args.includes('--ui');

// Determine which command to run
let command;
if (isDebug) {
  command = 'npm run test:lambda:debug';
} else if (isUI) {
  command = 'npm run test:lambda:ui';
} else if (isHeaded) {
  command = 'npm run test:lambda:headed';
} else {
  command = 'npm run test:lambda';
}

console.log(`🚀 Running command: ${command}`);
console.log('⏳ Starting tests...\n');

// Run the tests
const testProcess = spawn('npm', ['run', command.split(' ')[2]], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  console.log('\n' + '=' * 60);
  
  if (code === 0) {
    console.log('✅ Tests completed successfully!');
    console.log('\n📊 Test Results Available:');
    console.log('   - HTML Report: lambda-test-results/index.html');
    console.log('   - Screenshots: test-results/ (if any taken)');
    console.log('\n🔍 To view the HTML report, run:');
    console.log('   npm run report:lambda');
  } else {
    console.log('❌ Tests failed with exit code:', code);
    console.log('\n🔍 Check the output above for error details');
    console.log('📊 Test results and screenshots may be available in:');
    console.log('   - lambda-test-results/');
    console.log('   - test-results/');
  }
  
  console.log('\n💡 Available test commands:');
  console.log('   - npm run test:lambda          (headless)');
  console.log('   - npm run test:lambda:headed   (with browser UI)');
  console.log('   - npm run test:lambda:debug    (debug mode)');
  console.log('   - npm run test:lambda:ui       (Playwright UI mode)');
  console.log('   - node run-lambda-tests.js --headed');
  console.log('   - node run-lambda-tests.js --debug');
  console.log('   - node run-lambda-tests.js --ui');
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to start test process:', error.message);
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n⏹️  Test execution interrupted by user');
  testProcess.kill('SIGINT');
  process.exit(0);
});


