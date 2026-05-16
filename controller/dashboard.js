const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.getAccount = async (req,res)=>{
    const currUser=res.locals.currUser;
    res.render("dashboard/account.ejs",{currUser});
};

module.exports.getListings = async(req,res)=>{
    const currUser=res.locals.currUser;
    const allLists = await Listing.find({owner:currUser});
    if(!allLists){
        return res.render("dashboard/listings.ejs");
    }
    res.render("dashboard/listings.ejs",{allLists});
};

// for buyer
module.exports.myBookings = async(req,res)=>{
    const currUser=res.locals.currUser;
    const allBookings = await Booking.find({user:currUser}).populate({
        path:"listing",
        populate: {path: "owner", select: "username"}
    }).populate("user");//pulls in the full listing doc
    if(!allBookings){
        return res.render("dashboard/myBookings.ejs");
    }
    res.render("dashboard/myBookings.ejs",{allBookings});
};

// for seller
module.exports.listBookings = async(req,res)=>{
    const currUser=res.locals.currUser;
    const allBookings = await Booking.find({})
        .populate({
            path: "listing",
            match: { owner: currUser }
        })
        .populate("user");
    // Filter out bookings where listing.owner doesn't match (populate sets to null)
    const filteredBookings = allBookings.filter(booking => booking.listing !== null);
    if(!filteredBookings || filteredBookings.length === 0){
        return res.render("dashboard/listBookings.ejs");
    }
    res.render("dashboard/listBookings.ejs",{allBookings: filteredBookings});
};

module.exports.getWishlist = async(req,res)=>{
    const currUser=res.locals.currUser;
    res.render("dashboard/wishlist.ejs",{currUser});
};

module.exports.getChats = async (req,res)=>{
    const currUser=res.locals.currUser;
    res.render("dashboard/chats.ejs",{currUser});
};