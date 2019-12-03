const Auth = require('../models/user');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    const createdUser = new Auth(req.body);
    createdUser.save()
        .then(user => {
            user.salt = undefined;
            user.hashed_password = undefined;
            res.status(200).json(user);
        })
        .catch(error => res.status(400).json({error: errorHandler(error)}));
};

exports.signin = (req, res) => {
    const {email, password} = req.body;

    Auth.findOne({email}, (err, user) => {
        if(err && !user) {
            return res.status(400).json({error: `User with email - ${email} not found.`});
        }

        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;
        return res.status(200).json({token, user: {_id, name, email, role}});
    })
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: 'Sign out success'});
};

exports.requireSignIn = expressjwt({
    'secret': process.env.JWT_SECRET,
    'userProperty': "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) {
        return res.status(403).json({
            'err': 'Access denied.'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(200).json({
            'err': 'Admin resource! Access denied.'
        });
    }

    next();
};

