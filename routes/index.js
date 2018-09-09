var express = require("express");
var route = express.Router();
var passport = require("passport")
var User = require("../models/user")

//Route route
route.get("/",function(req,res){
    res.render("landing");
});


//Auth Routes
//REGISTRATION
route.get("/register",function(req,res){
    res.render("register");

});

route.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    var password = req.body.password;
    User.register(newUser,password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
    });
});
});

//LOGIN
route.get("/login",function(req,res){
    res.render("login");
});
//login logic
//middleware
route.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(){

});

//LOGOUT
route.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


//MIDDLEWARE
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = route;
