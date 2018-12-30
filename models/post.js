const mongoose = require('mongoose');

const postSchema = {
    time: {
        type: Date,
        default: Date.now
    },
    title: String,
    img: String,
    body: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
};

module.exports = mongoose.model('post', postSchema);