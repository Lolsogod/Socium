var mongoose = require("mongoose");

var commentSchema = {
    /*time: {
        type: Date,
        default: Date.now
    },*/
    text: String,
    user: String,
};

module.exports = mongoose.model("Comment", commentSchema);