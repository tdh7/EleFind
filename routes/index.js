var express = require('express');
var router = express.Router();

var IndexController = require('../controllers');

var SignInController = require('../controllers/account/sign_in');
var SignUpController = require('../controllers/account/sign_up');
var UpdateInfoController = require('../controllers/account/update_info');
var AccountRecoveryController = require('../controllers/account/account_recovery');


var ProductItemDetailController = require('../controllers/product/product_item_detail');
var ProductListController = require('../controllers/product/product_list_by_type');

var SearchController = require('../controllers/util/search');

var CartController = require('../controllers/order/cart');
var CheckoutController = require('../controllers/order/checkout');
var HistoryOrderController = require('../controllers/order/history');

router.get('/',IndexController.home);

router.get('/dang-nhap',SignInController.sign_in);
router.get('/dang-ky',SignUpController.sign_up);
router.get('/cap-nhat-tai-khoan', UpdateInfoController.update_info);
router.get('/cntk', UpdateInfoController.update_info);
router.get('/quen-mat-khau', AccountRecoveryController.account_recovery);


router.get('/xem-chi-tiet',ProductItemDetailController.product_detail);
router.get('/danh-sach-san-pham-theo-loai', ProductListController.list_by_type);

router.get('/tim-kiem', SearchController.index);

router.get('/thong-tin-don-hang',CheckoutController.checkout);
router.get('/quan-ly-gio-hang', CartController.cart);
router.get('/lich-su-mua-hang',HistoryOrderController.historycart);

module.exports = router;


