const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    // Event details
    eventName: { type: String, required: true },
    guests: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    requests: { type: String },

    phone:{
        type:String,
        required:true
    },

    total_price: {
        type: Number,
        required: true
    },

    // Status flow
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    payment_status: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid"
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,    
},{timestamps:true});

module.exports = mongoose.model("Booking", bookingSchema);