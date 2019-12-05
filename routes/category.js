const express   = require('express');
const router    = express.Router();
const { createCategory, read, categoryById, update, remove, list } = require('../controllers/category');
const { requireSignIn, isAdmin }   = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);
router.get('/categories', list);

router.post('/category/create/:userId', requireSignIn, isAdmin, createCategory);
router.put('/category/:categoryId/:userId', requireSignIn, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignIn, isAdmin, remove);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;