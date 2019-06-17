const express = require('express');
const router = express.Router();

var controller = require('../controllers/history_order_controller');

router.get('/', controller.home);

module.exports = router;