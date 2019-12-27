const express   = require('express');
const router    = express.Router();
const { requireSignIn, isAuth }   = require('../controllers/auth');
const { createOrder }   = require('../controllers/orders');
const { decreaseQuantity }   = require('../controllers/product');
const { userById, addOrderToHistory } = require('../controllers/user');

router.post('/order/create/:userId', requireSignIn, isAuth, addOrderToHistory, decreaseQuantity, createOrder);

router.param('userId', userById);

module.exports = router;