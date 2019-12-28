const {Order, CartItem} = require('../models/order');
const {errorHandler}    = require('../helpers/dbErrorHandler');

exports.createOrder = (req, res) => {
   req.body.order.user = req.profile;
   const order = new Order(req.body.order);
   order.save((err, data) => {
      if(err) {
         return res.status(400).json({err: errorHandler(err)});
      }

      return res.json(data);
   });
};

exports.listOrders = (req, res) => {
   Order.find()
       .populate('user', '_id name address')
       .sort('-created')
       .exec((err, orders) => {
          if(err) {
             return res.status(400).json({err: errorHandler(err)});
          }

          res.json(orders);
       })
};