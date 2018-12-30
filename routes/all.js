const express = require("express"),
      Post = require("../models/post"),
      app = express.Router();

const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};      

//index
app.get("/", (req, res) =>{
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
//show
app.get("/:id", (req, res) =>{
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
//new
app.get("/new", (req, res) =>{
    res.render("new");
});
//create
app.post("/", isLoggedIn, (req, res) =>{
    Post.create(req.body.Post, (err, created) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect("/s/all");
        }
    });
});
//edit
app.get("/:id/edit", (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {
            post: foundPost
        });}
    });
});
//update
app.put("/:id", isLoggedIn, (req, res) =>{
    Post.findByIdAndUpdate(req.params.id, req.body.Post, (err, updatedPost) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect(req.params.id);
        }
    });
});

//destroy
app.delete("/:id", isLoggedIn, (req, res) =>{
    Post.findByIdAndDelete(req.params.id, (err) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect("/s/all/");
        }
    });
});

module.exports = app;