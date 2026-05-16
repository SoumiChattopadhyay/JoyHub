const User = require('../models/user');

module.exports.renderSignUpform = (req, res) => {
    res.render("user/signup.ejs");
}
module.exports.signUp = async (req, res, next) => {
    try {
        let { username, f_name, email, password } = req.body;
        const newUser = new User({
            username,
            email,
            f_name
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to JoyHub");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLogInform = (req, res) => {
    res.render("user/login.ejs");
}
module.exports.loginSuccess = async (req, res) => {
    req.flash("success", "You are logged in. Welcome back to JoyHub");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are now logged out.");
        res.redirect("/listings");
    });
}