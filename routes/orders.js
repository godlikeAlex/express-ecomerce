const express   = require('express');
const router    = express.Router();
const { requireSignIn, isAuth }   = require('../controllers/auth');
const { createOrder }   = require('../controllers/orders');
const { userById, addOrderToHistory } = require('../controllers/user');

router.post('/order/create/:userId', requireSignIn, isAuth, addOrderToHistory, createOrder);

router.param('userId', userById);

module.exports = router;