const Stripe = require('stripe');
const stripe = new Stripe("sk_test_51QdwPyRp7phkNDrXEKCj4GqHvAXXy3yAZEIv7tM4bRBs3CC0SP2wqClmtwx02Db7adujKpPUMI8mw0o1PsLNynVt00AoWATpgv"); // Replace with your secret key
module.exports = stripe;