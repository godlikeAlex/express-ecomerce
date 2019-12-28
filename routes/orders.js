const express   = require('express');
const router    = express.Router();
const { requireSignIn, isAuth, isAdmin }   = require('../controllers/auth');
const { createOrder, listOrders, getStatusValues, updateOrderStatus, orderById }   = require('../controllers/orders');
const { decreaseQuantity }   = require('../controllers/product');
const { userById, addOrderToHistory } = require('../controllers/user');

router.post('/order/create/:userId', requireSignIn, isAuth, addOrderToHistory, decreaseQuantity, createOrder);
router.get('/order/list/:userId', requireSignIn, isAuth, isAdmin, listOrders);
router.get('/order/status-values/:userId', requireSignIn, isAuth, isAdmin, getStatusValues);
router.put('/order/:orderId/status/:userId', requireSignIn, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;