const express   = require('express');
const router    = express.Router();
const { createCategory }        = require('../controllers/category');
const { requireSignIn, isAdmin }   = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requireSignIn, isAdmin, createCategory);
router.param('userId', userById);

module.exports = router;