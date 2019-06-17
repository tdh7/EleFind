const express = require('express');
const router = express.Router();

var controller = require('../controllers/cart_controller');

router.get('/', controller.home);

router.post('/add_to_cart',controller.add_to_cart);

module.exports = router;