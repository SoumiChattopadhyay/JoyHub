require("dotenv").config();
const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET
});
// console.log("🔥 Created instance:", instance);//debugging
module.exports = instance;