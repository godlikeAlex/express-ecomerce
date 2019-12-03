const express   = require('express');
const router    = express.Router();
const { createCategory, read, categoryById }        = require('../controllers/category');
const { requireSignIn, isAdmin }   = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignIn, isAdmin, createCategory);
router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;