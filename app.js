//?db & "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
//!delete this ugly function later
function errCheck(err, callback) {
    if (err) {
        console.log(err);
    } else {
        return callback;
    }
}

console.log("Loading please wait...");


//init
var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    Post = require("./modules/post"),
    Comment = require("./modules/comment"),
    env = require("dotenv").config(),
    passport = require("passport"),
    localStrategy = require("passport-local")
    User = require("./modules/user");


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

//=================
//*Passport config
//================

app.use(require("express-session")({
    secret: process.env.CRYPT,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=================
//*Main routes
//================

//index
app.get("/", function (req, res) {
    res.redirect("/s/all");
});

app.get("/s/all", function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                posts: posts
            });
        }
    });
});
//new
app.get("/s/all/new", function (req, res) {
    res.render("new");
});
//create
app.post("/s/all", function (req, res) {
    Post.create(req.body.Post, function (err, created) {
        errCheck(err, res.redirect("/s/all"));
    });
});
//edit
app.get("/s/all/:id/edit", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        errCheck(err, res.render("edit", {
            post: foundPost
        }));
    });
});
//update
app.put("/s/all/:id", function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.Post, function (err, updatedPost) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(req.params.id);
        }
    });
});

//show
app.get("/s/all/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                post: foundPost
            });
        }
    });
});
//delete
app.delete("/s/all/:id", function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/s/all/");
        }
    });
});

//======================
//*comments
//=====================

//new
app.post("/s/all/:id/comments", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.Comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/s/all/" + foundPost._id);
                }
            });
        }
    });
});

//=================
//*Auth routes
//================

//show
app.get("/register", function(req, res){
    res.render("register");
});
//registration logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/s/all/");
        });
    });
});

//starting
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server started on port 1000");
});