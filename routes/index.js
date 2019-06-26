var express = require("express");
var router = express.Router();
var passport   = require("passport");
var User = require("../models/User");


router.get("/",function(req,res){
    res.render("landing.ejs");
});

//AUTH ROUTES

//show register form
router.get("/register",function (req,res) {
    res.render("register");
});

//handle sinup logic
router.post("/register",function (req,res) {
    var newuser = new User({username:req.body.username});
    User.register(newuser,req.body.password,function (err,user) {
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function () {
                req.flash("success","Welcome to Yelpcamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//show login form
router.get("/login",function (req,res) {
    res.render("login");
});

//handle login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function (req,res) {
});

//logout logic
router.get("/logout",function (req, res) {
    req.flash("success","you logged out");
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;