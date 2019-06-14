const express = require('express');
const router = express.Router();

var controller = require('../controllers/checkout_controller');

router.get('/', controller.home);

module.exports = router;