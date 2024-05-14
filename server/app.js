const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddle = require('./middleware/authMiddle.js');
const { User, Post } = require('./models/db.js');

const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute');

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

app.use('/post', postRoute);
app.use('/user', userRoute);

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



app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}...`);
})
