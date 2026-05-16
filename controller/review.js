const Listing=require('../models/listing');
const Review=require('../models/review');

module.exports.createReview=async(req,res)=>{
    // console.log(req.params.id);
    let {id}=req.params;
    let listing=await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","New Review created successfully!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    req.flash("success","Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}