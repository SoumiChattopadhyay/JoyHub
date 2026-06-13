const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now//with Date.now() it is executed immediately when the schema loads, but with Date.now mongoose calls the function when the document is created.
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;