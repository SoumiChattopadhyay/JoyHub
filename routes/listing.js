const express = require('express');
const router = express.Router();//creating new router object using Router() constructor or class of express and this router object has methods get,post,put,delete like app object. 
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');//The ./ indicates that models is a subdirectory in the current directory.
const {isLoggedin,isOwner,validateListing}=require('../middleware/middleware.js');
const ListingController=require('../controller/listing.js');
const {storage}=require('../cloudConfig.js');
const multer=require('multer');
const upload=multer({storage});

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedin,
    upload.single("list[image]"),validateListing,
    wrapAsync(ListingController.createListing),
);


//New Route
router.get("/new",isLoggedin,ListingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedin,isOwner,upload.single("list[image]"),wrapAsync(ListingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(ListingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(ListingController.renderEditForm));


module.exports=router;