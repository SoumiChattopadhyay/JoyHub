const mongoose = require('mongoose');
const initData = require('./data.js');//require data(the array of docs)
const Listing = require('../models/listing.js');//require model

let url="mongodb://127.0.0.1:27017/joyhub";
main().then((res)=>console.log("connection established")).catch((err)=>console.log(err));
async function main(){
    await mongoose.connect(url);
}
const insertData = async()=>{
    await Listing.deleteMany({});
    initData.map((obj)=>{obj.owner="676d84cb7b6b6938e0b268b8";});
    await Listing.insertMany(initData);
    console.log("Data added");
}
insertData();