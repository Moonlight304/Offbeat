const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

router.use(express.json({ limit: '10mb' }));
router.use(cookieParser());
router.use(cors({ origin: 'http://localhost:5000', credentials: true }));

const authMiddle = require('../middleware/authMiddle.js');
const { User, Post } = require('../models/db.js');

router.get('/:postID', async (req, res) => {
    try {
        const { postID } = req.params;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            })

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        return res.json({
            status: 'success',
            post: post,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.post('/newPost', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { heading, body, base64String } = req.body;

        if (!heading)
            return res.json({
                status: 'fail',
                message: 'no heading',
            })

        if (!body)
            return res.json({
                status: 'fail',
                message: 'no body',
            })

        const username = req.user.username;
        const newPost = Post({ userID, username, heading, body, base64String });
        const savedPost = await newPost.save();

        const user = await User.findById(userID);
        user.posts.push(savedPost);
        await user.save();
``
        return res.json({
            status: 'success',
            message: 'Post added successfully',
            postID: savedPost._id
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/deletePost/:postID', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID } = req.params;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            })

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        if (userID !== post.userID._id.toString())
            return res.json({
                status: 'fail',
                message: 'cannot delete others posts',
            })

        await Post.deleteOne({ _id: postID });

        await User.updateOne(
            { _id: userID },
            { $pull: { posts: { _id: postID } } }
        );

        return res.json({
            status: 'success',
            message: 'deleted post successfully',
        })
    }
    catch (e) {
        return res.json({
            status: 'failure',
            message: 'Error : ' + e,
        })
    }
})

router.get('/like/:postID', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID } = req.params;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            });

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        if (post.likes.includes(userID))
            return res.json({
                status: 'fail',
                message: 'Already liked',
            })

        //update likecount and like array in post
        await Post.updateOne(
            { _id: postID },
            {
                $push: { likes: userID },
                $inc: { likeCount: 1 },
            }
        );

        //update likecount and like array in user's post
        const user = await User.findById(userID);
        await User.updateOne(
            { _id: userID, 'posts._id': postID },
            {
                $inc: { 'posts.$.likeCount': 1 },
                $push: { 'posts.$.likes': userID },
            }
        );

        return res.json({
            status: 'success',
            message: 'Incremented like count',
            newLikeCount: post.likeCount + 1,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/dislike/:postID', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID } = req.params;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            })

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        if (!post.likes.includes(userID))
            return res.json({
                status: 'fail',
                message: 'You did not like the post',
            })

        //update likecount and like array in post
        await Post.updateOne(
            { _id: postID },
            {
                $pull: { likes: userID },
                $inc: { likeCount: -1 },
            }
        );

        //update likecount and like array in user's post
        const user = await User.findById(userID);
        await User.updateOne(
            { _id: userID, 'posts._id': postID },
            {
                $inc: { 'posts.$.likeCount': -1 },
                $pull: { 'posts.$.likes': userID },
            }
        );

        return res.json({
            status: 'success',
            message: 'Decremented like count',
            newLikeCount: post.likeCount - 1,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/:postID/comments', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID } = req.params;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            })

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        return res.json({
            status: 'success',
            message: 'fetched all comments for post',
            comments: post.comments,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'failed to retreive comments',
        })
    }
})

router.post('/:postID/newComment', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID } = req.params;
        const { newComment } = req.body;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID is required',
            })

        if (!newComment)
            return res.json({
                status: 'fail',
                message: 'no comment text entered',
            })

        const post = await Post.findById(postID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'post not found',
            })

        console.log(req.user);

        const comment = {
            _id: new mongoose.mongo.ObjectId(),
            author: userID,
            username: req.user.username,
            content: newComment,
        };

        post.comments.unshift(comment);
        await post.save();

        await User.updateOne(
            { _id: userID, 'posts._id': postID },
            { $push: { 'posts.$.comments': { $each: [comment], $position: 0 } } }
        );

        return res.json({
            status: 'success',
            message: 'Saved comment',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/:postID/deleteComment/:commentID', authMiddle, async (req, res) => {
    try {
        const userID = req.user.userID;
        const { postID, commentID } = req.params;

        if (!postID || !commentID)
            return res.json({
                status: 'fail',
                message: 'Both postID and commentID are required',
            });

        const post = await Post.findById(postID);
        if (!post)
            return res.json({
                status: 'fail',
                message: 'Post not found',
            });

        const commentToBeDeleted = post.comments.find(
            (comment) => comment._id.toString() === commentID.toString()
        );

        if (!commentToBeDeleted)
            return res.json({
                status: 'fail',
                message: 'Comment not found',
            });

        if (commentToBeDeleted.author.toString() !== userID.toString())
            return res.json({
                status: 'fail',
                message: 'You cannot delete others comments',
            });

        const deletePostUpdateResult = await Post.updateOne(
            { _id: postID },
            { $pull: { comments: { _id: commentID } } }
        );
        if (deletePostUpdateResult.modifiedCount === 0) {
            return res.json({
                status: 'fail',
                message: 'Failed to delete comment from post',
            });
        }

        const deleteUserUpdateResult = await User.updateOne(
            { _id: userID, 'posts._id': postID },
            { $pull: { 'posts.$.comments': { _id: commentID } } }
        );
        if (deleteUserUpdateResult.modifiedCount === 0) {
            return res.json({
                status: 'fail',
                message: 'Failed to delete comment from user data',
            });
        }

        return res.json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error ' + e,
        })
    }
});

module.exports = router;