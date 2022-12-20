const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.token;

    if (!authHeader) {
        return res.status(401).json("Token not found")
    };

    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.PRIVATE_KEY, (err, user) => {
        if (err) {
            return res.status(403).json('Invalid token');
        } else {
            req.user = user;
            next();
        }
    }
    )
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.admin) {
            next()
        } else {
            res.status(403).json('You are not authorized')
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.admin) {
            next();
        } else {
            res.status(403).json('You do not have permission')
        }
    })
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }