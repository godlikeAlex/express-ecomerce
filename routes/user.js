const express   = require('express');
const router    = express.Router();
const { signup, signin }        = require('../controllers/user');
const {userSignUpValidator} = require('../validator');

router.post('/signup', userSignUpValidator, signup);
router.post('/signin', userSignUpValidator, signin);

module.exports = router;