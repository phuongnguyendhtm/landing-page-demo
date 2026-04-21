const axios = require('axios');

async function test() {
    try {
        console.log("Testing local chatbot at http://localhost:3000/.netlify/functions/chat...");
        const response = await axios.post('http://localhost:3000/.netlify/functions/chat', {
            message: "Chào bạn, giới thiệu về FreeUp Academy?"
        });
        console.log("✅ Chatbot Response Success!");
        console.log("Reply:", response.data.reply);
    } catch (error) {
        console.error("❌ Test Failed:", error.response ? error.response.status : error.message);
        if (error.response) console.error("Data:", error.response.data);
    }
}

test();
