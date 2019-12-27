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