'use strict';
const Comm = require('../models/comment'),
      Post = require('../models/post');

const mwObj = {};

mwObj.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
};
mwObj.isOwner = (req, res, next) =>{
    if(req.isAuthenticated()){
        Post.findById(req.params.id, (err, foundPost) =>{
            if (err) {
                req.flash('error', 'Post not found');
                res.redirect('back');
            } else {
                if(foundPost.user.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You have not permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first');
        res.redirect('back');
    }
};

mwObj.isCommentator = (req, res, next) =>{
    if(req.isAuthenticated()){
        Comm.findById(req.params.coId, (err, foundComment) =>{
            if (err) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                if(foundComment.user.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You have not permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to login first');
        res.redirect('back');
    }
};

module.exports = mwObj;