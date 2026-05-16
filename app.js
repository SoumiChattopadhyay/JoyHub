if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const bookingRouter = require('./routes/booking.js');
const dashboardRouter = require('./routes/dashboard.js');
const session=require('express-session');
const flash=require("connect-flash");
const passport=require('passport');// middleware for handling user authentication in Node.js.
const LocalStrategy=require('passport-local');//There are packages that implement specific authentication mechanisms. Help us not write extra code
const User = require('./models/user.js');
const Listing=require('./models/listing.js');
const Booking = require('./models/booking.js');
const { isLoggedin } = require('./middleware/middleware.js');
const { title } = require('process');

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");//tells Express to use EJS as the default view engine for rendering templates.
app.engine("ejs",ejsMate);//registering ejs-mate as the custom rendering engine for .ejs files in your Express application.e replacing the default engine with ejs-mate.which adds extra functionality, such as - Support for layouts, Simplified inheritance between templates.
app.use(express.static(path.join(__dirname,"public")));//app.use("/images",express.static(path.join(__dirname, "images")));//When you specify /images, you're telling Express to serve static files only when the URL begins with /images.
app.use(express.urlencoded({extended:true})); //parse the incoming request body
app.use(express.json()); // parse JSON bodies
app.use(methodOverride("_method"));

const sessionOptions={
    secret:"#apnawebsite",
    resave:false,
    saveUninitialized:true,//session is created even if is data is not added to it
    cookies:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,//to prevent cross-Scripting attacks
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//Initializes Passport.js for each request. Passport.js is a middleware for Node.js used for handling authentication in your application. i supports many authentication strategies
app.use(passport.session());//Enables session handling for Passport (stores user data across requests)
passport.use(new LocalStrategy(User.authenticate()));// Uses LocalStrategy for authentication using passport-local-mongoose. Passport provides an authenticate() function, which is used as route middleware to authenticate requests.

passport.serializeUser(User.serializeUser());// Serialize the user to store user information in the session
passport.deserializeUser(User.deserializeUser());// Deserialize the user to retrieve user data from the session

// app.get("/demouser",async(req,res)=>{
//     const u1 = new User({
//         email:"ruhi@gmail.com",
//         username:"ruhi"
//     });
//     const registeredUser = await User.register(u1,"ruhipassword");//register is a static method added to the Mongoose User model by passport-local-mongoose.It simplifies user registration by automatically handling the password hashing and saving the user to the database. I also checks if the username entered  is unique or not. register is asynchronous function
//     res.send(registeredUser);
// });
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);//flash must come before the routes
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/listings/:list_id/booking",bookingRouter);
app.use("/dashboard",dashboardRouter);



//establising connection b/w app.js file and MongoDB database
let url="mongodb://127.0.0.1:27017/joyhub";
main().then(res=>{
    console.log("connection estalished successfully");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(url);
}

//Category Route
app.get("/category/:c",async(req,res)=>{
    let {c}=req.params;
    let listings=await Listing.find({category:c});
    res.render("listing/index2.ejs",{listings});
});

//Search Route
app.get("/search",async(req,res)=>{
    const{q}=req.query;
    
    let parts=[];
    parts = q.trim().split(/\s+/);

    let conditions=[];
    parts.forEach(word => {
        if(isNaN(parseInt(word))){
            conditions.push({title:{$regex:word,$options:"i"}});
            conditions.push({category:{$regex:word,$options:"i"}});
            conditions.push({location:{$regex:word,$options:"i"}});
        }else{
            conditions.push({price:{$lte:parseInt(word)}});
            conditions.push({capacity:{$gte:parseInt(word)}});
        }
    });
    const listings = await Listing.find({$or:conditions});
    res.render("listing/index2.ejs",{listings,q});
});

//If request doesn't match any of previous routes then this is executed
app.all("*",(req,res)=>{
    throw new ExpressError(404,"Page not found");
});

//Error-Handling Middleware
app.use((err,req,res,next)=>{
    // let {status=500,message="some error occurred",stack}=err;
    let {statusCode=500,message="some error occurred",stack}=err;
    res.status(statusCode).render("listing/error.ejs",{err});
    // res.status(statusCode).send(statusCode+" "+message+" "+stack);
});

app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});
