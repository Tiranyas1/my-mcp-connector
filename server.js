const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Get auth token from environment variable
const authToken = process.env.MCP_AUTH_TOKEN;

if (!authToken) {
  console.error('MCP_AUTH_TOKEN environment variable is required');
  process.exit(1);
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'MCP Connector with Playwright is running',
    timestamp: new Date().toISOString(),
    hasAuthToken: !!authToken
  });
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
  console.log(`Auth token configured: ${authToken ? 'Yes' : 'No'}`);
});

// Start MCP Connector
console.log('Starting MCP Connector with Playwright...');
const mcpProcess = spawn('npx', ['@typingmind/mcp', authToken], {
  stdio: 'inherit'
});

mcpProcess.on('error', (error) => {
  console.error('Failed to start MCP Connector:', error);
});

mcpProcess.on('close', (code) => {
  console.log(`MCP Connector exited with code ${code}`);
});
