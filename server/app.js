const express = require('express');
const app = express();
const axios = require('axios');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddle = require('./middleware/authMiddle.js');
const { User, Post } = require('./models/db.js');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET_CODE;

mongoose.connect('mongodb://localhost:27017/offbeat')
    .then(() => {
        console.log('DB connected');
    })
    .catch((e) => {
        console.log('DB Error ' + e);
    })

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5000', credentials: true }));

// list all posts
app.get('/', async (req, res) => {
    try {
        const allPosts = await Post.find({}).sort({ createdAt: -1 });

        return res.json({
            status: 'success',
            count: allPosts.length,
            allPosts,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

app.get('/post/:postID', async (req, res) => {
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

app.post('/post/newPost', authMiddle, async (req, res) => {
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

app.get('/post/deletePost/:postID', authMiddle, async (req, res) => {
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

app.get('/post/like/:postID', authMiddle, async (req, res) => {
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

app.get('/post/dislike/:postID', authMiddle, async (req, res) => {
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

app.get('/post/:postID/comments', authMiddle, async (req, res) => {
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

app.post('/post/:postID/newComment', authMiddle, async (req, res) => {
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

app.get('/post/:postID/deleteComment/:commentID', authMiddle, async (req, res) => {
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


//sign up
app.post('/signup', async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'username required',
            })

        if (!password)
            return res.json({
                status: 'fail',
                message: 'password required',
            })

        const existingUser = await User.findOne({ username });

        if (existingUser)
            return res.json({
                status: 'fail',
                message: 'User exists',
            })

        // encrypting password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = User({ username, passwordHash });
        const savedUser = await newUser.save();

        //jwt tokens
        const jwt_token = jwt.sign({
            userID: savedUser._id,
            username: savedUser.username,
        }, JWT_SECRET);

        //sending cookie (HTTP-Only)
        return res.cookie('jwt_token', jwt_token, {
            httpOnly: true,
        }).json({
            status: 'success',
            message: 'User and cookie saved',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

//log in
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'username required',
            })

        if (!password)
            return res.json({
                status: 'fail',
                message: 'password required',
            })

        const existingUser = await User.findOne({ username: username });

        if (!existingUser)
            return res.json({
                status: 'fail',
                message: 'username or password invalid',
            })

        //password verification
        const passwordValid = await bcrypt.compare(password, existingUser.passwordHash);

        if (!passwordValid)
            return res.json({
                status: 'fail',
                message: 'username or password invalid',
            })

        //sign the token
        const jwt_token = jwt.sign({
            userID: existingUser._id,
            username: existingUser.username,
        }, JWT_SECRET);

        //send cookie
        return res.cookie('jwt_token', jwt_token, {
            httpOnly: true,
        }).json({
            status: 'success',
            message: 'user logged in',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

//log out
app.get('/logout', (req, res) => {
    try {
        if (!req.cookies.jwt_token)
            return res.json({
                status: 'fail',
                message: 'already logged out',
            })

        res.clearCookie('jwt_token');

        return res.json({
            status: 'success',
            message: 'Logged out',
        });
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

app.get('/check', authMiddle, (req, res) => {
    try {
        const { userID, username } = req.user;

        if (!userID || !username)
            return res.json({
                status: 'success',
                message: 'check successfull',
                userID,
                username,
            });
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'check failed',
        })
    }
})

app.get('/user/:username', authMiddle, async (req, res) => {
    try {
        const { username } = req.params;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'no username',
            })

        const user = await User.findOne({ username });

        if (!user)
            return res.json({
                status: 'fail',
                message: 'no user found',
            })

        const { passwordHash, ...userData } = user.toObject();

        return res.json({
            status: 'success',
            message: 'fetched user',
            userData
        })
    }
    catch (e) {
        console.log('Error : ' + e);
    }
})

app.post('/user/uploadAvatar', authMiddle, async (req, res) => {
    try {
        const { base64String } = req.body;
        const { userID } = req.user;

        if (!userID || !base64String)
            return res.json({
                status: 'fail',
                message: 'no userID or avatar string'
            })


        const user = await User.findById(userID);

        if (!user)
            return res.json({
                status: 'fail',
                message: 'no user found'
            })

        user.avatarString = base64String;
        await user.save();

        return res.json({
            status: 'success',
            message: 'avatar updated',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e
        })
    }
})


app.get('/user/deleteAvatar/:username', authMiddle, async (req, res) => {
    try {
        // const { userID } = req.user;
        const { username } = req.params;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'no username'
            })

        const user = await User.findOne({ username });

        if (!user)
            return res.json({
                status: 'fail',
                message: 'no user found'
            })

        user.avatarString = '';
        await user.save();

        return res.json({
            status: 'success',
            message: 'avatar deleted',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e
        })
    }
})

app.get('/user/deleteUser/:username', authMiddle, async (req, res) => {
    try {
        const { username } = req.params;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'no username found',
            })

        await User.deleteOne({ username });

        return res.json({
            status: 'success',
            message: 'deleted user',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}...`);
})
