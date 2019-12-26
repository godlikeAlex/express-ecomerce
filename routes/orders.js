const express   = require('express');
const router    = express.Router();
const { requireSignIn, isAuth }   = require('../controllers/auth');
const { create }   = require('../controllers/orders');
const { userById } = require('../controllers/user');

router.post('/order/create/:userId', requireSignIn, isAuth);

router.param('userId', userById);

module.exports = router;