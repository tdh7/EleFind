const express = require('express');
const router = express.Router();

var productController = require('../controllers/product_controller');

router.get('/danh-sach-san-pham', productController.home);
router.get('/toan-bo-san-pham', productController.home);

router.get('/', productController.home);

router.get('/:category-:productId', productController.product_detail);
router.get('/:category-:productId/review',productController.get_review);

module.exports = router;