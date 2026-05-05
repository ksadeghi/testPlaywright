



// Global teardown for Lambda Web Application tests
async function globalTeardown(config) {
  console.log('🏁 Lambda Web Application UI Tests Completed');
  console.log('📊 Check test results in:');
  console.log('   - HTML Report: lambda-test-results/index.html');
  console.log('   - JSON Report: lambda-test-results.json');
  console.log('   - Screenshots: test-results/ (if any failures)');
  
  // Additional cleanup can be added here if needed
  // For example, database cleanup, file cleanup, etc.
}

module.exports = globalTeardown;



