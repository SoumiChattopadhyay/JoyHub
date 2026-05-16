const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const instance = require("../utils/razorpay.js");
const crypto = require("crypto");

module.exports.renderbookForm = async (req, res) => {
    const { list_id } = req.params;
    res.render("booking/bookingForm.ejs", { list_id });
};

module.exports.createOrder = async (req, res) => {
    try {
        const { list_id } = req.params;
        const listing = await Listing.findById(list_id);

        const { startDate, endDate, startTime, endTime } = req.body.booking;
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const durationHours = Math.ceil((end - start) / (1000 * 60 * 60));

        let totalPrice = listing.price * durationHours;

        const options = {
            amount: (totalPrice) * 100,//in paise (Razorpay uses smallest units)
            currency: "INR",
        }

        // console.log("Instance:", instance);

        const order = await instance.orders.create(options);

        req.session.amount = totalPrice;
        req.session.bookingData = req.body.booking;//store temporarily in session

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: totalPrice * 100,
            keyId: process.env.RAZORPAY_API_KEY_ID
        });

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while submitting your booking.");
        const { list_id } = req.params;
        res.redirect(`/listings/${list_id}`);
    }
};

module.exports.verifyPayment = async (req, res) => {
    try {
        const { list_id } = req.params;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            req.flash("error", "Payment verification failed");
            return res.redirect(`/listings/${list_id}`);
        }

        // console.log(res.locals.currUser);
        
        const newBooking = new Booking({
            ...req.session.bookingData,//razorpay doesnt send booking doc in req.body it sends those written previously so we must store booking data temporarily in session to use it
            listing: list_id,
            user: res.locals.currUser._id,
            total_price: req.session.amount,
            payment_status: "paid",
            status: "confirmed",
            razorpay_order_id,
            razorpay_payment_id
        });
        await newBooking.save();

        req.flash("success", "Booking confirmed.");
        return res.redirect(`/listings/${list_id}/booking/payment`);
    } catch (err) {
        console.error("VERIFY ERROR:", err);
        return res.status(500).send("Something went wrong");
    }
}

module.exports.payment = async (req, res) => {
    res.render("booking/payment.ejs");
}

// module.exports.confirmBooking = async (req, res) => {
//     const { id } = req.params;
//     const booking = await Booking.findById(id);
//     booking.status = "confirmed";// Owner approved the request
//     booking.save();
//     res.redirect(`/bookings/${id}`);
// };

// module.exports.declineBooking = async (req, res) => {
//     const { id } = req.params;
//     const booking = await Booking.findById(id);
//     booking.status = "declined";// Owner rejected the request
//     booking.save();
//     res.redirect(`/bookings/${id}`);
// };