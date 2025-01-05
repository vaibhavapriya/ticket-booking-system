const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SK); 
module.exports = stripe;