




// Global setup for LOCAL Lambda Web Application tests
async function globalSetup(config) {
  console.log('🚀 Starting LOCAL Lambda Web Application UI Tests');
  console.log('📋 Test Configuration:');
  console.log(`   - Base URL: ${config.use?.baseURL || 'http://localhost:8000'}`);
  console.log(`   - Browser Projects: ${config.projects?.map(p => p.name).join(', ') || 'chromium, firefox, webkit'}`);
  console.log(`   - Test Files: ${config.testMatch || '**/lambda-webapp.spec.js'}`);
  console.log('⏳ Waiting for local server to start...');
  
  // Additional setup can be added here if needed
  // For example, database setup, API mocking, etc.
}

module.exports = globalSetup;




