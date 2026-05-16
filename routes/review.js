const express = require('express');
const router = express.Router({mergeParams:true});//Parent route(/listings/:id/review) is in app.js and the remaining route i.e. the child routes(/,/:reviewId) is in routes folder in review.js file so the file never gets access to the id of the listing sent as request parameter so we use mergeparams so that child route gets access to it
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');//The ./ indicates that models is a subdirectory in the current directory.
const Review=require('../models/review.js');
const {isLoggedin,validateReview,isAuthor}=require('../middleware/middleware.js');
const ReviewController=require('../controller/review.js');

//Review Post Route
router.post("/",isLoggedin,validateReview,wrapAsync(ReviewController.createReview));

//Review Delete Route
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(ReviewController.destroyReview));

module.exports = router;