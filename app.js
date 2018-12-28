//?db & "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
//!delete this ugly function later
function errCheck(err, callback) {
    if (err) {
        console.log(err);
    } else {
        return callback;
    }
}

console.log("Loading please wait...");


//init
var express        = require("express"),
    app            = express(),
    bodyParser     = require('body-parser'),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    Post           = require("./modules/post"),
    Comment        = require("./modules/comment");
mongoose.connect("mongodb+srv://openSocDB:soc@rayovskycl-kz0kg.mongodb.net/socium" //here you can connect your own db
);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

//=================
//*Main routes
//================

//index
app.get("/", function (req, res) {
    res.redirect("/s/all");
});

app.get("/s/all", function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {res.render("index", {
            posts: posts
        });
    }
    });
});
//new
app.get("/s/all/new", function (req, res) {
    res.render("new");
});
//create
app.post("/s/all", function (req, res) {
    Post.create(req.body.Post, function (err, created) {
        errCheck(err, res.redirect("/s/all"));
    });
});
//edit
app.get("/s/all/:id/edit", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        errCheck(err, res.render("edit", {
            post: foundPost
        }));
    });
});
//update
app.put("/s/all/:id", function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.Post, function (err, updatedPost) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(req.params.id);
        }
    });
});

//show
app.get("/s/all/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec( function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {res.render("show", {
            post: foundPost
        });
       }
    });
});
//delete
app.delete("/s/all/:id", function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/s/all/");
        }
    });
});

//======================
//*comments
//=====================

//new
app.post("/s/all/:id/comments", function (req, res) {
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.Comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else{
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/s/all/" + foundPost._id);
                }
            });
        }
    });
});

//starting
app.listen(process.env.PORT || 1000, process.env.IP);
console.log("Server started on port 1000"); 