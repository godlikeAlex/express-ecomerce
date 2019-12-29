const User = require('../models/user');
const {Order} = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(200).json({'err': 'User not found'});
        }
        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err, user) => {
        if(err) {
            return res.status(400).json({err: 'You are not authorized to preform this action.'});
        }
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        return res.status(200).json(user);
    });
};

exports.addOrderToHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transactionId: req.body.order.transactionId,
            amount: req.body.order.amount
        });
    });

    User.findOneAndUpdate({_id: req.profile._id}, {$push: {history}}, {new: true}, (err, data) => {
        if(err) {
            return res.status(400).json({
                err: 'Cloud not update user history'
            })
        }
        next();
    })
};

exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }

            res.status(200).json(orders);
        })
};