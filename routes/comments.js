'use strict';
const express = require('express'),
      Post = require('../models/post'),
      app = express.Router({mergeParams: true}),
      mw = require('../middleware'),
      Comm = require('../models/comment');

//new
app.post('/', mw.isLoggedIn, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        if (err) {
            console.log(err);
        } else {
            Comm.create(req.body.comment, (err, comment) =>{
                if (err) {
                    console.log(err);
                } else {
                    comment.user.id = req.user._id;
                    comment.user.username = req.user.username;
                    comment.save();
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect(`/s/all/${foundPost._id}`);
                }
            });
        }
    });
});
//destroy
app.delete('/:coId', mw.isCommentator, (req, res) =>{
    Comm.findByIdAndDelete(req.params.coId, (err) =>{
        if(err){
            console.log(err);
        } else {
            res.redirect('back');
        }
    });
});
module.exports = app;