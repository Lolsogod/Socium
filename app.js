//?db & "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
console.log("Loading please wait...");

//init
//!delete this ugly function later
const express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    env = require("dotenv").config(),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user");

const errCheck = (err, callback) => {
    if (err) {
        console.log(err);
    } else {
        return callback;
    }
};

const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});
app.use(express.static(`${__dirname}/public`));
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
app.use((req, res, next) =>{
    res.locals.curUser = req.user;
    next();
});
//=================
//*Main routes
//================

//index
app.get("/", (req, res) =>{
    res.redirect("/s/all");
});

app.get("/s/all", (req, res) =>{
    Post.find({}, (err, posts) =>{
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
app.get("/s/all/new", (req, res) =>{
    res.render("new");
});
//create
app.post("/s/all", isLoggedIn, (req, res) =>{
    Post.create(req.body.Post, (err, created) =>{
        errCheck(err, res.redirect("/s/all"));
    });
});
//edit
app.get("/s/all/:id/edit", (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        errCheck(err, res.render("edit", {
            post: foundPost
        }));
    });
});
//update
app.put("/s/all/:id", isLoggedIn, (req, res) =>{
    Post.findByIdAndUpdate(req.params.id, req.body.Post, (err, updatedPost) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect(req.params.id);
        }
    });
});

//show
app.get("/s/all/:id", (req, res) =>{
    Post.findById(req.params.id).populate("comments").exec((err, foundPost) =>{
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
app.delete("/s/all/:id", isLoggedIn, (req, res) =>{
    Post.findByIdAndDelete(req.params.id, (err) =>{
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
app.post("/s/all/:id/comments", isLoggedIn, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.Comment, (err, comment) =>{
                if (err) {
                    console.log(err);
                } else {
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect(`/s/all/${foundPost._id}`);
                }
            });
        }
    });
});

//=================
//*Auth routes
//================

//show sing up form
app.get("/register", (req, res) =>{
    res.render("register");
});
//registration logic
app.post("/register", (req, res) =>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () =>{
            res.redirect("/s/all/");
        });
    });
});

//show
app.get("/login", (req, res) =>{
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local",{
    successRedirect: "/s/all",
    failureRedirect: "/login"
}), (req, res)=>{

});
//logout
app.get("/logout", (req,res) =>{
    req.logOut();
    res.redirect("/s/all");
});



//starting
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server started on port 1000");
});