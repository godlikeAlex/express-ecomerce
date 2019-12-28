const express   = require('express');
const router    = express.Router();
const { requireSignIn, isAuth, isAdmin }   = require('../controllers/auth');
const { createOrder, listOrders }   = require('../controllers/orders');
const { decreaseQuantity }   = require('../controllers/product');
const { userById, addOrderToHistory } = require('../controllers/user');

router.post('/order/create/:userId', requireSignIn, isAuth, addOrderToHistory, decreaseQuantity, createOrder);
router.get('/order/list/:userId', requireSignIn, isAuth, isAdmin, listOrders);

router.param('userId', userById);

module.exports = router;