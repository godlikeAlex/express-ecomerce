const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    console.log(req.body);
    const createdUser = new User(req.body);
    createdUser.save()
        .then(user => {
            user.salt = undefined;
            user.hashed_password = undefined;
            res.status(200).json(user);
        })
        .catch(error => res.status(400).json({err: errorHandler(error)}));
};