var express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
     passport = require("passport"),
     localStrategy = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose"),
     Campgrounds = require("./models/campground"),
     Comments = require("./models/comments"),
     seedsDB = require("./seeds"),
     User = require("./models/user"),
     methodOverride = require("method-override");


//Requiring the routes
var commentsRoutes = require("./routes/comments.js"),
    campgroundsRoutes = require("./routes/campgrounds.js"),
    indexRoutes = require("./routes/index.js");
//Our Seeds
// seedsDB();

mongoose.connect("mongodb://localhost/yelpCamp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

//PASSING A OBJECT INTO EVERY ROUTES
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//Password Conf.
app.use(require("express-session")({
    secret:"Rusty is a dog",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(commentsRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);



app.listen("3000",function(){
    console.log("Server has started");
})