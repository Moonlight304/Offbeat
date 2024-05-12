const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_CODE;

function authMiddle(req, res, next) {
    try {
        const jwt_token = req.cookies.jwt_token;

        if (!jwt_token)
            return res.json({
                status: 'fail',
                message: 'no token found',
            })
            
        const decodedObj = jwt.verify(jwt_token, JWT_SECRET);
        req.user = decodedObj;

        next();
    }
    catch (e) {
        return res.json({
            status: 'fail',
            message: 'Error : ' + e,
        })
    }
}

module.exports = authMiddle;