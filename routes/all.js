'use strict';
const express = require('express'),
      Post = require('../models/post'),
      mw = require('../middleware'),
      app = express.Router();

//index
app.get('/', (req, res) =>{
    Post.find({}, (err, posts) =>{
        if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('/s/all/');
        } else {
            res.render('index', {
                posts: posts
            });
        }
    });
});
//new
app.get('/new', mw.isLoggedIn, (req, res) =>{
    res.render('new');
});
//create
app.post('/', mw.isLoggedIn, (req, res) =>{
    Post.create(req.body.Post, (err/*,createdPost*/) =>{
        if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('/s/all/');
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
            req.flash('error', 'Something went wrong');
            res.redirect('/s/all/');
        } else {
            res.render('show', {
                post: foundPost
            });
        }
    });
}
});
//edit
app.get('/:id/edit', mw.isOwner, (req, res) =>{
    Post.findById(req.params.id, (err, foundPost) =>{
        res.render('edit', {post: foundPost});
    });     
});
//update
app.put('/:id', mw.isOwner, (req, res) =>{
    Post.findByIdAndUpdate(req.params.id, req.body.Post, (err/*, updatedPost*/) =>{
        if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('/s/all/');
        } else {
            req.flash('success', 'Updated successfully');            
            res.redirect(req.params.id);
        }
    });
});

//destroy
app.delete('/:id', mw.isOwner, (req, res) =>{
    Post.findByIdAndDelete(req.params.id, (/*err*/) =>{
        req.flash('success', 'Removed successfully');    
        res.redirect('/s/all/');
    });
});

module.exports = app;

