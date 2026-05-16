const { default: MaplibreGeocoder } = require('@maplibre/maplibre-gl-geocoder');
const Listing=require('../models/listing');
const ExpressError=require('../utils/ExpressError');
const geocoder=require('@maplibre/maplibre-gl-geocoder');
const Geo=require('../public/js/map_geocoder');

module.exports.index=async(req,res)=>{
    let allLists = await Listing.find({});
    res.render("listing/index.ejs",{allLists});//  relative path, starting from the directory set as the views folder in your Express app.If you prefix the path with /, like "/listing/index.ejs", it will not work because it tries to find the file at the root of your filesystem, which is incorrect.
}
module.exports.renderNewForm = (req,res)=>{
    // throw new Error("wont send ;)");
    res.render("listing/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let coordinates=listing.coordinates;
    res.render("listing/show.ejs",{listing,coordinates});
}
module.exports.createListing=async(req,res,next)=>{      
      const location = req.body.list.location; 
      const coords = await Geo.forwardGeocode({query:location}); 
      console.log(coords);

    console.log(req.body);
    console.log(req.body.list);
    let url=req.file.path;
    let filename=req.file.filename; 
    
        const newList = new Listing(req.body.list);
        newList.coordinates=coords;
        newList.owner=req.user._id;
        newList.image={url,filename};
        await newList.save();
        req.flash("success","Listing added successfully!");
        res.redirect("/listings");
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/e_blur:300,h_200,w_250");
    res.render("listing/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    console.log(req.body.list);
    // if(typeof req.file !== "undefined"){
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        req.body.list.image={url,filename};
    }
    if(!req.body.list){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.list});
    req.flash("success","Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let delList = await Listing.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
}