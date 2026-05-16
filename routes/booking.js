const express = require('express');
const router = express.Router({mergeParams:true});
const BookingController = require('../controller/booking');
const { isLoggedin, validateBooking } = require("../middleware/middleware");

router.route("/")
    .get(isLoggedin, BookingController.renderbookForm)
    .post(validateBooking, BookingController.createOrder);

router.post("/verifyPayment",BookingController.verifyPayment);

router.get("/payment", BookingController.payment);

// router.get("/:id", isLoggedin, BookingController.showBookings);

// router.post("/:id/confirm", isLoggedin, BookingController.confirmBooking);
// router.post("/:id/decline", isLoggedin, BookingController.declineBooking);

module.exports = router;