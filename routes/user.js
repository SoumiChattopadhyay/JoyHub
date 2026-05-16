const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require('passport');
const {saveRedirectUrl}=require('../middleware/middleware.js');
const UserController=require('../controller/user.js');

router.route("/signup")
.get(UserController.renderSignUpform)
.post(wrapAsync(UserController.signUp));

router.route("/login")
.get(UserController.renderLogInform)
.post(saveRedirectUrl,
    passport.authenticate('local',{
        failureRedirect:'/login',
        failureFlash:true
    }),
    UserController.loginSuccess);

router.get("/logout",UserController.logout);

module.exports=router;