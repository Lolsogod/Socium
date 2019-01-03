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

const isCommentator = (req, res, next) =>{
    if(req.isAuthenticated()){
        Comm.findById(req.params.coId, (err, foundComment) =>{
            if (err) {
                res.redirect('back');
            } else {
                if(foundComment.user.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
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
app.delete('/:coId', isCommentator, (req, res) =>{
    Comm.findByIdAndDelete(req.params.coId, (err) =>{
        if(err){
            console.log(err);
        } else {
            res.redirect('back');
        }
    });
});
module.exports = app;