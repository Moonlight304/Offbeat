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
postSchema.index({_id : 1, likes: 1})


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarString: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500,
    },
    gender: {
        type: String,
        default: 'none',
        enum: ['Male', 'Female', 'none'],
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    followersCount: {
        type: Number,
        default: 0,
        required: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    followingCount: {
        type: Number,
        default: 0,
        required: true,
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
})
userSchema.index({ username: 1 });
userSchema.index({ savedPosts: 1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });


const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
    User,
    Post,
}