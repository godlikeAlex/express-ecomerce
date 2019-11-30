const express   = require('express');
const router    = express.Router();
const { create }        = require('../controllers/product');
const { requireSignIn, isAdmin }   = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/product/create/:userId', requireSignIn, isAdmin, create);
router.param('userId', userById);

module.exports = router;