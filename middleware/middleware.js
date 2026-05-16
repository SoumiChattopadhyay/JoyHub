const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema, bookingSchema } = require('../schema.js');//This is Validation Schema previous one in models folder was Database Schema

module.exports.isLoggedin = (req, res, next) => {
    // console.log(req.user,req.path,req.originalUrl);
    if (!req.isAuthenticated()) {//if user is not logged in
        req.session.redirectUrl = req.originalUrl;//then this is saved 
        req.flash("error", "You must be logged in first.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;//then this is saved
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {//will pass this as a middleware
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}
module.exports.validateBooking = async (req, res, next) => {
    const { list_id } = req.params;
    console.log(list_id);
    const listing = await Listing.findById(list_id);
    let { error } = bookingSchema.validate(req.body, {
        context: { capacity: listing.capacity }
    });
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
