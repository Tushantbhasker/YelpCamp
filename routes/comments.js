//===================
//COMMENTS ROUTES
//===================

var express = require("express");
var route = express.Router();

var Campgrounds = require("../models/campground");
var Comments = require("../models/comments");


route.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campgrounds.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });
});

route.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campgrounds.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            Comments.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    
                    //Adding the comments
                    comment.id.author = req.user._id;
                    comment.author.username = req.user.username;
                    //saving the comments
                    
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });

        }
    });
});
//MIDDLEWARE
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = route;