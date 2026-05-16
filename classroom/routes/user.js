const express = require('express');
const router = express.Router({mergeparams:true});

//Index Route
router.get("/",(req,res)=>{
    res.send("GET for users");
});
//Show Route
router.get("/:id",(req,res)=>{
    res.send("GET for user id");
});
//Post Route
router.post("/",(req,res)=>{
    res.send("POST for users");
});
router.delete("/:id",(req,res)=>{
    res.send("DELETE for user id");
});

module.exports=router;