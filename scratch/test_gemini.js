require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing API Key:", apiKey ? "Found" : "Missing");
    if (!apiKey) return;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // List models
        // Note: The SDK doesn't have a direct listModels but we can try a few common strings
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
        
        for (const m of models) {
            console.log(`Testing model: ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`✅ ${m} works! Response: ${response.text().substring(0, 20)}`);
                return;
            } catch (e) {
                console.log(`❌ ${m} failed: ${e.message.substring(0, 50)}`);
            }
        }
    } catch (error) {
        console.error("Critical Error:", error.message);
    }
}

test();
