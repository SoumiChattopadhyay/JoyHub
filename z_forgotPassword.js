const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/joyhub")
    .then(async () => {
        const user = await User.findOne({ username: "joe" });

        user.f_name = user.f_name || "Joe Wheeler";// ✅ Fix missing field

        await user.setPassword("123");  // 👈 new password
        
        await user.save();

        console.log("Password reset done ✅");
        mongoose.connection.close();
    });