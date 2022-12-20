const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registration
router.post('/register', async (req, res) => {
    //bcrypt
    const saltRounds = 10;
    const plainTextPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    if (!(req.body.email && req.body.password)) {
        res.json(400).json("Email and password required");
        return;
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        User.findOne({ email: req.body.email }).then(async user => {
            if (user) {
                res.status(409).json('Email already exists');
                return;
            } else {
                const savedUser = await newUser.save();
                res.status(200).json('User registered');
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }

});

//Login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const inputPassword = req.body.password;

    if (!(email && password)) {
        return res.status(400).json('Username and password required')
    }

    try {
        const userExists = await User.exists({ email: email });
        if (userExists) {
            User.findOne({ email: email }).then(async user => {
                bcrypt.compare(inputPassword, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json("Internal server error");
                    }
                    else {
                        if (result) {
                            const accessToken = jwt.sign({
                                id: user._id,
                                admin: user.admin
                            }, process.env.PRIVATE_KEY, { expiresIn: '3h' });

                            const { password, ...others } = user._doc;
                            res.status(200).json({ ...others, accessToken })
                        } else {
                            res.status(401).json('Wrong email or password')
                        }
                    }
                })
            })

        } else {
            res.status(403).json('email does not exist, create new account')
        }
    }
    catch (err) {
        res.status(500).json("Internal server error")
    }
})
module.exports = router;