const express = require('express');
const router = express.Router({mergeparams:true});

//Index Route
router.get("/",(req,res)=>{
    res.send("GET for posts");
});
//Show Route
router.get("/:id",(req,res)=>{
    res.send("GET for post id");
});
//Post Route
router.post("/",(req,res)=>{
    res.send("POST for posts");
});
router.delete("/:id",(req,res)=>{
    res.send("DELETE for post id");
});

module.exports=router;