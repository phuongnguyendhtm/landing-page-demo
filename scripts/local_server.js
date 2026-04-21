const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

// Load the chat function logic directly
const chatFunction = require('../netlify/functions/chat').handler;
const adminFunction = require('../netlify/functions/admin').handler;
const sepayWebhookFunction = require('../netlify/functions/sepay-webhook').handler;

// Serve static files from landing-page
app.use(express.static(path.join(__dirname, '../landing-page')));

async function proxy(handler, req, res) {
    const event = {
        httpMethod: req.method,
        path: req.path,
        body: JSON.stringify(req.body),
        headers: req.headers
    };
    try {
        const result = await handler(event, {});
        res.status(result.statusCode || 200)
           .set('Content-Type', 'application/json')
           .send(result.body);
    } catch (err) {
        console.error('Function Proxy Error:', err);
        res.status(500).json({ error: 'Local server failed to execute function.' });
    }
}

// Routes
app.all('/.netlify/functions/chat', (req, res) => proxy(chatFunction, req, res));
app.use('/.netlify/functions/admin', (req, res) => proxy(adminFunction, req, res));
app.all('/.netlify/functions/sepay-webhook', (req, res) => proxy(sepayWebhookFunction, req, res));

app.listen(port, () => {
    console.log(`\n🚀 FREEUP ACADEMY LOCAL SERVER RUNNING`);
    console.log(`-------------------------------------`);
    console.log(`🔗 Web: http://localhost:${port}`);
    console.log(`💬 Chat: http://localhost:${port}/.netlify/functions/chat`);
    console.log(`-------------------------------------\n`);
    console.log(`Lưu ý: Bạn hãy mở link http://localhost:${port} để test chatbot nhé!\n`);
});
