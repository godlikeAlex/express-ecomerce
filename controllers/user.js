const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(200).json({'err': 'User not found'});
        }
        req.profile = user;
        next();
    });
};