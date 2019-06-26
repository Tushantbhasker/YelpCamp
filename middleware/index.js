var Campground = require("../models/campground");
var Comment = require("../models/comment");

//middleware goes here...........
var middlewareObj = {};

middlewareObj.CheckCampgroundOwnership = function (req , res , next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function (err, foundCampground) {
            if(err){
                req.flash("error","you don't have permission to do that");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","you don't have permission to do that");
        res.redirect("back");
    }
};

middlewareObj.CheckCommentOwnership = function (req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function (err, foundcomment) {
            if(err){
                req.flash("error","you don't have permission to do that");
                res.redirect("back");
            } else{
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","you don't have permission to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn  = function (req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please log in first");
    res.redirect("/login");
};

module.exports = middlewareObj;