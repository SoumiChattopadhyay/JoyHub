const mongoose = require('mongoose');
const Listing = require('../models/listing.js');//require model

let url="mongodb://127.0.0.1:27017/joyhub";
main().then((res)=>console.log("connection established")).catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(url);
}

async function updatePrices(){
    const listings = await Listing.find({},{
        capacity:1,
        country:1,
        category:1
   }).lean();

   const operations = listings.map(listing =>({
        updateOne : {
            filter:{_id:listing._id},
            update:{
                $set:{price:calculateListingPrice(listing)}
            }
        }
   }));
   await Listing.bulkWrite(operations);
  console.log("Prices updated successfully");
}

function calculateListingPrice(listing){
    const basePrice = 500;
  let price = basePrice + listing.capacity * 40;

  const countryMultiplier = {
    "United States": 1.3,
    "United Kingdom": 1.25,
    "Germany": 1.2,
    "France": 1.2,
    "Australia": 1.25,
    "Japan": 1.3,
    "Singapore": 1.35,
    "UAE": 1.4,
    "India": 0.9,
  };
  price *= countryMultiplier[listing.country] || 1.1;

  return Math.max(Math.round(price), 1000);
}

updatePrices();