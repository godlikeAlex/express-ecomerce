const express   = require('express');
const router    = express.Router();
const { create, productById, read, remove, update, list, listRelated } = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin }   = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.put('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, update);
router.delete('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, remove);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;