var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({},function(err, allcampground){
        if(err){
            req.flash("error","something went wrong!!");
            console.log(err);
        }else{
            res.render("campground/campgrounds",{campgrounds : allcampground});
        }
    });
});

router.post("/", middleware.isLoggedIn ,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id :req.user._id,
        username: req.user.username
    };
    var newcampground = {name: name, img: image, description: description ,author: author};

    Campground.create(newcampground,function (err,campground) {
        if(err){
            console.log(err);
        }else{
            console.log("Newly created campground:");
            console.log(campground);
        }
    });

    req.flash("success","Campground added !!");
    res.redirect("/campgrounds");
});

router.get("/new", middleware.isLoggedIn , function(req,res){
    res.render("campground/new");
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log(err);
            }else{
            res.render("campground/show",{campground: foundcampground});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.CheckCampgroundOwnership , function (req,res) {
    Campground.findById(req.params.id,function (err, foundcampground) {
       if(err){
           console.log(err);
       } else{
           res.render("campground/edit",{ campground : foundcampground });
       }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.CheckCampgroundOwnership , function (req,res) {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err, campground) {
       if(err){
           console.log(err);
       } else{
           req.flash("success","campground updated!!");
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
});

//DELETE CAMPGROUND
router.delete("/:id", middleware.CheckCampgroundOwnership , function (req,res) {
    Campground.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            console.log(err);
        }
    });
    req.flash("success","campground deleted!!");
    res.redirect("/campgrounds");
});

module.exports = router;