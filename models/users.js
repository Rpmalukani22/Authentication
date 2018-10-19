var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
module.exports={"User" : mongoose.model("User",userSchema)};