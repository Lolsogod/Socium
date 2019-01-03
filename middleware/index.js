'use strict';
const Comm = require('../models/comment'),
      Post = require('../models/post');

const mwObj = {};

mwObj.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
mwObj.isOwner = (req, res, next) =>{
    if(req.isAuthenticated()){
        Post.findById(req.params.id, (err, foundPost) =>{
            if (err) {
                res.redirect('back');
            } else {
                if(foundPost.user.id.equals(req.user._id)){
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

mwObj.isCommentator = (req, res, next) =>{
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

module.exports = mwObj;