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
    }],
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
};

module.exports = mongoose.model('post', postSchema);