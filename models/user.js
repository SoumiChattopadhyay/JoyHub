const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const passportLocalmongoose=require('passport-local-mongoose');//A Mongoose plugin that simplifies username/password authentication. It automatically handles password hashing, validation, and user registration, making it easier to work with Passport in Mongoose-based apps.
const userSchema = new Schema({
    f_name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    }//username and password would be added so we dont need to add it
});
userSchema.plugin(passportLocalmongoose);//
module.exports=mongoose.model("User",userSchema);

/* .plugin(): This is a Mongoose schema method that allows us to apply a plugin function to the schema.
It takes a plugin function as an argument. This plugin function will be executed with the schema as its input and can modify the schema by adding the necessary fields and methods for authentication.
passport-local-Mongoose is a library that exports a plugin function. So we can say passportLocalMongoose is the plugin function. When this function is called, it receives the schema and modifies it  */