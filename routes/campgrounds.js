var express = require("express");
var route = express.Router();
var Campgrounds = require("../models/campground");


route.get("/campgrounds",function(req,res){
    Campgrounds.find({},function(err,camp){
        if(err){
            console.log("Oh no!");
        }
        else{
            res.render("campgrounds/campgrounds",{camp:camp});
        }
    });    
    
})
// New Campground
route.post("/campgrounds",isLoggedIn,function(req,res){
    var name = req.body.name;
    var url = req.body.url;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCamp = {
        name: name,
        image: url,
        descpriction: desc,
        author: author
    };
    Campgrounds.create(newCamp,function(err,data){
        if(err){
            console.log("Oh no!");
        }
        else{
            console.log("New Added");
            res.redirect("/campgrounds");
        }
    });
   
});
route.get("/campgrounds/new",isLoggedIn,function(req,res){
   
    res.render("campgrounds/form.ejs");
})
route.get("/campgrounds/:id",function(req,res){
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err,data){
        if(err){
            console.log("Oh no!");
        }
        else{
            res.render("campgrounds/show",{camp:data});
        }
    });
});

//Edit route
route.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req,res){
    Campgrounds.findById(req.params.id,function(err, campground){
        res.render("campgrounds/edit",{campground:campground});
            
    });   
});
//Update route
route.put("/campgrounds/:id",checkCampgroundOwnership, function(req,res){
    
    Campgrounds.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCamp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Destroy campground route
route.delete("/campgrounds/:id", checkCampgroundOwnership,function(req,res){
        Campgrounds.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log(err);
            }else{

                res.redirect("/campgrounds");
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
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id,function(err, campground){
            if(err){
                console.log(err);
            }
            else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
               
            }
        });
    }
    else{
        res.redirect("back");
    }
}
module.exports = route;