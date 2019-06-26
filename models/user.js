var mongoose = require("mongoose"),
    PassportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username:String,
    Password:String
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", userSchema);