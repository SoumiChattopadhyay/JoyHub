const express=require('express');
const app=express();
const path=require('path');
const session = require('express-session');
const flash = require('connect-flash');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

//Making http slightly stateful using Express sessions
app.use(//middleware setup for session handling
    session({
        secret:"#hfbvdr",
        resave:false,
        saveUninitialized:true
    })
);/*app.use middleware is called every time a request is received by the server. Since it's defined at the top (before any route handlers), it will run before any route is processed (for all routes).
The session() middleware sets up a session for each incoming request. It stores session-related data in req.session, which can be used later by your route handlers. The session persists across multiple requests from the same client (using a session cookie).*/
app.use(flash());//middleware to setup flash messages in our express application. Flash messages are temporary messages that are stored in the session and can be displayed to the user after a redirect.To use flash(), you need to install the connect-flash package and use it as middleware.This middleware will add a req.flash() method to the req object, allowing you to store flash messages for use in your route handlers.

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
});//Now these variables successMsg and errorMsg are defined in all ejs templates and dont need to be explicitly passed with res.redirect
app.get("/register",(req,res)=>{
    let {name="Anonymous"}=req.query;
    req.session.name=name;//declaring a name variable for the req.session object and storing name in it
    if(name=="Anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","user registered successfully");
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.locals.msg=req.flash("success");
    res.render("hello.ejs",{name:req.session.name});
    // res.render("hello.ejs",{name:req.session.name,msg:req.flash("success")});//In JavaScript, the object { req.session.name } will be interpreted as shorthand for { req: { session: { name: value } } }, which is not what you want. The correct way to pass a variable is to use a key that represents the variable you want to send to the template.
});

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You sent ${req.session.count} requests.`);
    console.log(req.session);//req.session is an object and we can create new variables in it(like we created count)
});

// const user = require('./routes/user.js');
// const post = require('./routes/post.js');
// const cookieParser = require('cookie-parser');

// app.use("/users",user);
// app.use("/posts",post);
// app.use(cookieParser("secretcode"));

// //Server sending cookies to browser. Cookies are small chunks of data which will get stored in Browser and even if user navigates through different other pages of our website this cookie will remain stored in the browser. Cookies can be used for user tracking, user authorization and storing user preferences and also to store user details before storing them in database. If user selected dark mode in root page of website even if he goes to other pages of that website dark mode is still applied. 
// //Sending Signed Cookie
// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("greet","namaste",{signed:true});
//     res.cookie("color","red",{signed:true});
//     res.cookie("made-in","India",{signed:true});
//     res.send("cookie sent");
// });
// //Verifying Signed Cookie
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// //user sending cookie with request
// app.get("/greet",(req,res)=>{
//     let {name="Anonymous"}=req.cookies;
//     res.send(`Hello ${name}`);
// });
// //Root Route
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("got cookies");
// });

app.listen(6999,(req,res)=>{
    console.log("server is listening to port 6999");
});
/*How It Works Together

/register?name=John saves the name to the session and redirects to /hello.

/hello fetches name from the session and greets the user.

/reqcount tracks how many times the user accesses this endpoint, storing the count in the session.

Data (like name and count) persists between requests as long as the session is active.*/