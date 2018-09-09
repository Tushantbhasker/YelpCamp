var mongoose = require("mongoose"),
    Campgrounds = require("./models/campground"),
    Comments = require("./models/comments");


var data = [
    {
        name:"night",
        image:"https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__340.jpg",
        descpriction:"Bla bAL bal"
    },
    {
        name:"Mountain",
        image:"https://cdn.pixabay.com/photo/2017/02/14/03/03/ama-dablam-2064522__340.jpg",
        descpriction:"Bla BAl BAl"
    },
    {
        name:"River",
        image:"https://cdn.pixabay.com/photo/2018/05/09/05/37/colorado-3384598__340.jpg",
        descpriction:"bla bla bla"
    }
];
function seeds(){
    Campgrounds.remove(function(err){
        if(err){
            console.log("error");
        }
        else{
            console.log("remove");
            data.forEach(function(camp){
                Campgrounds.create(camp,function(err,data){
                    if(err){
                        console.log("Oh no!");
                    }
                    else{
                        console.log("Added");
                        Comments.create({
                            text:"Great place but you know!!",
                            author:"Homer"
                        },function(err,comment){
                            if(err){
                                console.log("Oh no!");
                            }
                            else{
                                data.comments.push(comment);
                                data.save();
                            }
                        })
                    }
                })
            })
         }
    });
   
}

module.exports = seeds;
