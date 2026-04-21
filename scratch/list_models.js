require('dotenv').config();
const axios = require('axios');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        console.log("Available Models:");
        response.data.models.forEach(m => console.log("- " + m.name));
    } catch (error) {
        console.error("Error Status:", error.response ? error.response.status : "No response");
        console.error("Error Data:", error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

test();
