const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
    },
    heading: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    base64String: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likeCount: {
        type: Number,
        default: 0,
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    comments: [commentSchema],
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarString: {
        type: String,
        default: '',
    },
    posts: [postSchema],
    savedPosts: [postSchema],
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
    User,
    Post,
}