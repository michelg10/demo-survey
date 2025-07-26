const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;
const HOST = 'localhost';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Survey server is running' });
});

// Start server
app.listen(PORT, HOST, () => {
    const serverUrl = `http://${HOST}:${PORT}`;
    console.log('🚀 Survey server starting...');
    console.log(`📍 Serving files from: ${__dirname}`);
    console.log(`🌐 Server running at: ${serverUrl}`);
    console.log(`📖 Open your browser to: ${serverUrl}`);
    console.log('🛑 Press Ctrl+C to stop the server');
    console.log('-'.repeat(50));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped.');
    process.exit(0);
});
