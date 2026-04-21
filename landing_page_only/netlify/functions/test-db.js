exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            status: "Running in Serverless Mode",
            note: "SQLite is disabled due to binary incompatibility on Netlify.",
            hardcoded_product: "AI First Training - 199k"
        })
    };
};
