const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

router.use(express.json({ limit: '10mb' }));
router.use(cookieParser());
router.use(cors({ origin: process.env.frontendURL, credentials: true }));

const authMiddle = require('../middleware/authMiddle.js');
const { User, Post } = require('../models/db.js');

router.get('/check', authMiddle, (req, res) => {
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

router.get('/:username', async (req, res) => {
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

router.post('/uploadAvatar', authMiddle, async (req, res) => {
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

router.get('/deleteAvatar/:username', authMiddle, async (req, res) => {
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

router.post('/editUser/:username', authMiddle, async (req, res) => {
    try {
        const { username } = req.params;
        const { email, bio, gender } = req.body;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'no username found',
            })

        const user = await User.findOne({ username });

        if (!user)
            return res.json({
                status: 'fail',
                message: 'user not found',
            })

        user.email = email;
        user.bio = bio;
        user.gender = gender;
        await user.save();

        return res.json({
            status: 'success',
            message: 'updated user profile',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/deleteUser/:username', authMiddle, async (req, res) => {
    try {
        const { username } = req.params;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'Username not found',
            })

        await User.deleteOne({ username });

        return res.json({
            status: 'success',
            message: 'Deleted account',
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/savePost/:postID', authMiddle, async (req, res) => {
    try {
        const { postID } = req.params;
        const { userID } = req.user;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID not found',
            })

        if (!userID)
            return res.json({
                status: 'fail',
                message: 'userID not found',
            })

        const user = await User.findById(userID);
        if (!user)
            return res.json({
                status: 'fail',
                message: 'user not found',
            })

        if (user.savedPosts.includes(postID))
            return res.json({
                status: 'fail',
                message: 'Already saved post',
            })

        user.savedPosts.push(postID);
        await user.save();

        return res.json({
            status: 'success',
            message: 'post saved',
        })
    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/deleteSavedPost/:postID', authMiddle, async (req, res) => {
    try {
        const { postID } = req.params;
        const { userID } = req.user;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID not found',
            })

        if (!userID)
            return res.json({
                status: 'fail',
                message: 'userID not found',
            })

        const user = await User.findById(userID);
        if (!user)
            return res.json({
                status: 'fail',
                message: 'user not found',
            })

        if (!user.savedPosts.includes(postID))
            return res.json({
                status: 'fail',
                message: 'did not even save post',
            })

        await User.updateOne(
            { _id: userID },
            { $pull: { savedPosts: postID } }
        )

        return res.json({
            status: 'success',
            message: 'removed post from saved items',
        })

    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.get('/checkSaved/:postID', authMiddle, async (req, res) => {
    try {
        const { postID } = req.params;
        const { userID } = req.user;

        if (!postID)
            return res.json({
                status: 'fail',
                message: 'postID not found',
            })

        if (!userID)
            return res.json({
                status: 'fail',
                message: 'userID not found',
            })

        const post = await Post.findById(postID);
        const user = await User.findById(userID);

        if (!post)
            return res.json({
                status: 'fail',
                message: 'Post not found',
            })

        if (!user)
            return res.json({
                status: 'fail',
                messge: 'User not found'
            })

        if (user.savedPosts.includes(postID))
            return res.json({
                status: 'success',
                message: JSON.stringify(true),
            })
        else
            return res.json({
                status: 'success',
                message: JSON.stringify(false),
            })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.post('/follow', authMiddle, async (req, res) => {
    try {
        const { srcUsername, destUsername } = req.body;

        if (!srcUsername || !destUsername)
            return res.json({
                status: 'fail',
                message: 'no src or des username'
            })

        const srcUser = await User.findOne({ username: srcUsername });
        const destUser = await User.findOne({ username: destUsername });


        if (destUser.followers !== undefined && destUser.followers.includes(srcUser._id))
            return res.json({
                status: 'fail',
                message: 'already following user',
            })


        await User.updateOne(
            { username: srcUsername },
            {
                $push: { following: destUser._id },
                $inc: { followingCount: 1 }
            }
        )

        await User.updateOne(
            { username: destUsername },
            {
                $push: { followers: srcUser._id },
                $inc: { followersCount: 1 }
            }
        )

        res.json({
            status: 'success',
            message: 'followed user',
        })
    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.post('/unfollow', authMiddle, async (req, res) => {
    try {
        const { srcUsername, destUsername } = req.body;

        if (!srcUsername || !destUsername)
            return res.json({
                status: 'fail',
                message: 'no src or des username'
            })

        const srcUser = await User.findOne({ username: srcUsername });
        const destUser = await User.findOne({ username: destUsername });

        if (destUser.followers === undefined)
            return res.json({
                status: 'fail',
                message: 'already unfollowed',
            })

        if (!destUser.followers.includes(srcUser._id))
            return res.json({
                status: 'fail',
                message: 'not following user',
            })

        await User.updateOne(
            { username: destUsername },
            {
                $pull: { followers: srcUser._id },
                $inc: { followersCount: -1 }
            }
        )

        await User.updateOne(
            { username: srcUsername },
            {
                $pull: { following: destUser._id },
                $inc: { followingCount: -1 }
            }
        )


        res.json({
            status: 'success',
            message: 'followed user',
        })
    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

router.post('/getIsFollowing', authMiddle, async (req, res) => {
    try {
        const { srcUsername, destUsername } = req.body;

        if (!srcUsername || !destUsername)
            return res.json({
                status: 'fail',
                message: 'no src or des username'
            })

        const srcUser = await User.findOne({ username: srcUsername });
        const destUser = await User.findOne({ username: destUsername });

        if (destUser.followers !== undefined && destUser.followers.includes(srcUser._id))
            return res.json({
                status: 'success',
                message: JSON.stringify(true),
            })
        else 
            return res.json({
                status: 'success',
                message: JSON.stringify(false),
            })
    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

module.exports = router;