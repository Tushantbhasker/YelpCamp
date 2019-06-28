var express                     = require("express"),
    app                         = express(),
    bodyparser                  = require("body-parser"),
    mongoose                    = require("mongoose"),
    flash                       = require("connect-flash"),
    Campground                  = require("./models/campground"),
    seedDB                      = require("./seeds"),
    Comment                     = require("./models/comment"),
    User                        = require("./models/User"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose"),
    methodOverride              = require("method-override");

var indexRoutes             = require("./routes/index"),
    commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campground");

mongoose.connect("mongodb://localhost/yelp_camp",{ useMongoClient: true });
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "rusty is my dong name",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port,() => {
   console.log("server has started");
});
