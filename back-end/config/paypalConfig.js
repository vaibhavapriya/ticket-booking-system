const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

// Define the PayPal environment (sandbox for development, live for production)
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// For production environment, use this:
// const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

// Create a PayPal API client
const client = new paypal.core.PayPalHttpClient(environment);

// Export PayPal client for use in other parts of the app
module.exports = client;
