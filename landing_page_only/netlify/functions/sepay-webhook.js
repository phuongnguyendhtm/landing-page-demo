exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('SePay Webhook Received (Demo Mode):', data);

        // In Demo mode, we just log the transaction.
        // To make this real, connect to a Cloud DB (Supabase/MongoDB).
        
        return { 
            statusCode: 200, 
            body: JSON.stringify({ 
                success: true, 
                message: 'Webhook received in Demo Mode. Connect a real DB to update order status.' 
            }) 
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
