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

mongoose.connect(process.env.dbURL)
    .then(() => {
        console.log('DB connected');
    })
    .catch((e) => {
        console.log('DB Error ' + e);
    })

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: process.env.frontendURL, credentials: true }));

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

        const { username, password, confirmPassword } = req.body;

        if (!username)
            return res.json({
                status: 'fail',
                message: 'Username required',
            })

        if (!password)
            return res.json({
                status: 'fail',
                message: 'Password required',
            })

        if (!confirmPassword)
            return res.json({
                status: 'fail',
                message: 'Confirm password required'
            })

        if (password !== confirmPassword)
            return res.json({
                status: 'fail',
                message: 'Passwords do not match',
            })

        const existingUser = await User.findOne({ username });

        if (existingUser)
            return res.json({
                status: 'fail',
                message: 'Username already exists',
            })

        // encrypting password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = User({ username, passwordHash });
        const savedUser = await newUser.save();

        //sign the token
        const jwt_token = jwt.sign(
            {
                userID: savedUser._id,
                username: savedUser.username
            },
            JWT_SECRET
        );

        return res.json({
            status: 'success',
            message: 'Logged in',
            jwt_token,
        })
    }
    catch (e) {
        res.json({
            status: 'fail',
            message: 'Error signing up: ' + e,
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
                message: 'Username required',
            })

        if (!password)
            return res.json({
                status: 'fail',
                message: 'Password required',
            })

        const existingUser = await User.findOne({ username: username });

        if (!existingUser)
            return res.json({
                status: 'fail',
                message: 'Username or Password invalid',
            })

        //password verification
        const passwordValid = await bcrypt.compare(password, existingUser.passwordHash);

        if (!passwordValid)
            return res.json({
                status: 'fail',
                message: 'Username or Password invalid',
            })

        //sign the token
        const jwt_token = jwt.sign(
            {
                userID: existingUser._id,
                username: existingUser.username
            },
            JWT_SECRET
        );

        return res.json({
            status: 'success',
            message: 'Logged in',
            jwt_token,
        })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error logging in : ' + e,
        })
    }
})

//log out
app.get('/logout', authMiddle, (req, res) => {
    try {
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

app.post('/adminAuth', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.json({
                status: 'fail',
                message: 'No username or password',
            })

        if (username === process.env.adminUsername && password === process.env.adminPassword)
            return res.json({
                status: 'success',
                message: 'Authenticated',
            })
        else
            return res.json({
                status: 'fail',
                message: 'Authentication failed!',
            })
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
})

app.post('/dropDB', async (req, res) => {
    try {
        const { key } = req.body;

        if (!key)
            return res.json({
                status: 'fail',
                message: 'No key provided!',
            })

        if (key === process.env.dropKey) {
            await mongoose.connection.db.dropDatabase();
            return res.json({
                status: 'success',
                message: 'Deleted Database!',
            })
        }
        else
            return res.json({
                status: 'fail',
                message: 'Wrong Key!!',
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
