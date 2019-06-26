var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//   COMMENTS ROUTES

router.get("/new", middleware.isLoggedIn , function (req,res) {
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/comments",{campground : campground});
        }
    })
});

router.post("/", middleware.isLoggedIn ,function (req,res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function (err,comment) {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success","successfully commented!!");
                res.redirect("/campgrounds/"+req.params.id);
            });
        }
    });
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.CheckCommentOwnership ,function (req,res) {
    Comment.findById(req.params.comment_id,function (err,foundcomment) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit",{comment: foundcomment , campground_id: req.params.id });
        }
    })
});

//UPDATE COMMENT
router.put("/:comment_id", middleware.CheckCommentOwnership ,function (req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedcomment) {
       if(err){
           console.log(err);
       }else{
           req.flash("success","comment updated!!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});

//DELETE COMMENT
router.delete("/:comment_id", middleware.CheckCommentOwnership ,function (req,res) {
   Comment.findByIdAndRemove(req.params.comment_id,function (err) {
       if(err){
           console.log(err)
       }else{
           req.flash("success","comment deleted!!");
           res.redirect("/campgrounds/"+ req.params.id );
       }
   });
});

module.exports = router;