const express = require('express');
const router = express.Router();

var controller = require('../controllers/cart_controller');

router.get('/', controller.home);

router.post('/add_to_cart',controller.add_to_cart);
router.post('/check_existed_cart',controller.check_existed_cart);
router.post('/plus',controller.plus);
router.post('/minus',controller.minus);
router.post('/remove',controller.remove);

module.exports = router;