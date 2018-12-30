'use strict';
const express = require('express'),
      Post = require('../models/post'),
      app = express.Router({mergeParams: true}),
      Comm = require('../models/comment');

const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

//new
app.post('/', isLoggedIn, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        if (err) {
            console.log(err);
        } else {
            Comm.create(req.body.comment, (err, comment) =>{
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

module.exports = app;