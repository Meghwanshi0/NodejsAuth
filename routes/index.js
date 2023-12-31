const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

console.log('router is laoded');

router.get('/',homeController.home);

router.use('/users', require('./users'));

module.exports=router;