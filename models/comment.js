const mongoose = require('mongoose');

const commentSchema = {
    /*time: {
        type: Date,
        default: Date.now
    },*/
    text: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }

};

module.exports = mongoose.model('Comment', commentSchema);