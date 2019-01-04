'use strict';
//?db & "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
console.log('Loading please wait...');

//init
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    flash = require('connect-flash'),
    /*Post = require('./models/post'),
    Comm = require('./models/comment'),*/
    User = require('./models/user');
//requiring routes
const indexRoutes =require('./routes'),
      allRoutes =require('./routes/all'),
      commentsRoutes =require('./routes/comments');

require('dotenv').config();

//mongoDB config
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());

//Passport config
app.use(require('express-session')({
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.curUser = req.user;
    next();
});

//routes
app.use(indexRoutes);
app.use('/s/all/', allRoutes);
app.use('/s/all/:id/comments', commentsRoutes);

app.get('*', function(req, res){
    res.render('err');
  });

//starting
app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server started on port 1000');
});