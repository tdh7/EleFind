const express = require('express');
const router = express.Router();

var controller = require('../controllers/account_management');
router.get('/', controller.home);
router.get('/cap-nhat',controller.update_info);

module.exports = router;