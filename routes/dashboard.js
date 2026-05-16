const express = require('express');
const router = express.Router();
const {getAccount,getListings,myBookings,listBookings,getWishlist,getChats} = require("../controller/dashboard.js");
const {isLoggedin} = require("../middleware/middleware.js");

// dashboard routes
router.get("/account",isLoggedin,getAccount);
router.get("/listings",isLoggedin,getListings);
router.get("/bookings",isLoggedin,myBookings);
router.get("/:list_id/bookings",isLoggedin,listBookings);
router.get("/wishlist",isLoggedin,getWishlist);
router.get("/chats",isLoggedin,getChats);

module.exports = router;