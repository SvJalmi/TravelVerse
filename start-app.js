const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TravelVerse Application...');

// Start backend server
const backend = spawn('node', ['server/simple-server.js'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

// Start frontend development server
const frontend = spawn('npx', ['vite', 'dev', '--host', '0.0.0.0', '--port', '5173'], {
  cwd: path.join(process.cwd(), 'client'),
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend error:', err);
});

console.log('✅ Both servers starting...');
console.log('📍 Backend: http://localhost:3000');
console.log('📍 Frontend: http://localhost:5173');