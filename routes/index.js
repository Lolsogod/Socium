'use strict';
const express = require('express'),
      app = express.Router(),
      User = require('../models/user'),
      passport = require('passport');

app.get('/', (req, res) =>{
    res.redirect('/s/all');
});

//show sing up form
app.get('/register', (req, res) =>{
    res.render('register');
});
//registration logic
app.post('/register', (req, res) =>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err/*, user*/) =>{
        if(err){
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () =>{
            req.flash('success', 'Successfully registered');
            res.redirect('/s/all/');
        });
    });
});

//show login form
app.get('/login', (req, res) =>{
    res.render('login');
});
//login logic
app.post('/login', passport.authenticate('local',{
    successRedirect: '/s/all',
    failureRedirect: '/login'
}), (req, res)=>{
    req.flash('error', err.message);
});
//logout
app.get('/logout', (req,res) =>{
    req.logOut();
    req.flash('success', 'Loged out');
    res.redirect('back');
});

module.exports = app;