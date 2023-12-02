const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersConrtoller = require('../controllers/users_controller');

router.get('/sign-in', usersConrtoller.signIn);
router.get('/sign-up', usersConrtoller.signUp);

router.post('/create', usersConrtoller.create);

// router.get('/sign-out', usersConrtoller.destroySession);

module.exports = router;