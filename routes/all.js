'use strict';
const express = require('express'),
      Post = require('../models/post'),
      app = express.Router();

const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};
const isOwner = (req, res, next) =>{
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
//index
app.get('/', (req, res) =>{
    Post.find({}, (err, posts) =>{
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                posts: posts
            });
        }
    });
});
//new
app.get('/new', isLoggedIn, (req, res) =>{
    res.render('new');
});
//create
app.post('/', isLoggedIn, (req, res) =>{
    Post.create(req.body.Post, (err/*,createdPost*/) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect('/s/all');
        }
    });
});
//show
app.get('/:id', (req, res) =>{
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Post.findById(req.params.id).populate('comments').exec((err, foundPost) =>{
        if (err) {
            console.log(err);
        } else {
            res.render('show', {
                post: foundPost
            });
        }
    });
}
});
//edit
app.get('/:id/edit', isOwner, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        res.render('edit', {post: foundPost});
    });     
});
//update
app.put('/:id', isOwner, (req, res) =>{
    Post.findByIdAndUpdate(req.params.id, req.body.Post, (err/*, updatedPost*/) =>{
        if (err) {
            console.log(err);
        } else {
            res.redirect(req.params.id);
        }
    });
});

//destroy
app.delete('/:id', isOwner, (req, res) =>{
    Post.findByIdAndDelete(req.params.id, (/*err*/) =>{
        res.redirect('/s/all/');
    });
});

module.exports = app;

