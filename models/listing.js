const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:Object,
        filename:String,
        url:String,
},
    capacity:Number,
    location:String,
    country:String,
    reviews:[
        {
           type:Schema.Types.ObjectId,
           ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
   coordinates:{
    type:[Number]
   },
   category:{
    type:String,
    enum:["Birthdays","Weddings","Meetings","Gatherings","Gardens","Studios","Conferences","Galleries","Beaches","Rooftops",""]
   },
   price:{
    type:Number
   }
});
//Creating Post Mongoose Middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews}});
});
module.exports=mongoose.model("Listing",listingSchema);//exporting the model