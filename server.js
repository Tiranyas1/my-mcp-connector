const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Get auth token from environment variable with your specific token as fallback
const authToken = process.env.MCP_AUTH_TOKEN || 'mcp-secret-2025-abc123xyz';

console.log('=== MCP Connector Starting ===');
console.log(`Port: ${PORT}`);
console.log(`Auth token configured: ${authToken ? 'Yes' : 'No'}`);

// Health check endpoint (original)
app.get('/', (req, res) => {
  res.json({ 
    status: 'MCP Connector with Playwright is running',
    timestamp: new Date().toISOString(),
    hasAuthToken: !!authToken,
    port: PORT,
    message: 'Ready to connect with TypingMind'
  });
});

// Ping endpoint for TypingMind connection test
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'MCP Connector is alive',
    timestamp: new Date().toISOString(),
    authToken: 'configured'
  });
});

// Health endpoint (alternative)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start the HTTP server first
app.listen(PORT, () => {
  console.log(`✅ Health check server running on port ${PORT}`);
  console.log(`🔐 Using auth token: mcp-secret-2025-abc123xyz`);
  console.log(`🌐 Available endpoints:`);
  console.log(`   - https://my-mcp-connector.onrender.com/`);
  console.log(`   - https://my-mcp-connector.onrender.com/ping`);
  console.log(`   - https://my-mcp-connector.onrender.com/health`);
  
  // Start MCP Connector after HTTP server is ready
  console.log('🚀 Starting MCP Connector with Playwright...');
  
  const mcpProcess = spawn('npx', ['@typingmind/mcp', authToken], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  mcpProcess.stdout.on('data', (data) => {
    console.log(`MCP STDOUT: ${data}`);
  });

  mcpProcess.stderr.on('data', (data) => {
    console.error(`MCP STDERR: ${data}`);
  });

  mcpProcess.on('error', (error) => {
    console.error('❌ Failed to start MCP Connector:', error);
  });

  mcpProcess.on('close', (code) => {
    console.log(`🔄 MCP Connector exited with code ${code}`);
    if (code !== 0) {
      console.error('MCP Connector failed, but HTTP server continues running');
    } else {
      console.log('✅ MCP Connector running successfully');
    }
  });
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});
