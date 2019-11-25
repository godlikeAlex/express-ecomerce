const express  = require('express');
const router   = express.Router();
const { userById } = require('../controllers/user');
const { requireSignIn, isAuth }   = require('../controllers/auth');

router.get('/secret/:userId', requireSignIn, isAuth, (req, res) => {
    res.json({
        user: req.profile
    });
});
router.param('userId', userById);

module.exports = router;