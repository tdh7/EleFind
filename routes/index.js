var express = require('express');
var router = express.Router();

var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: app_name });
});
router.get('/xem-chi-tiet/', function(req, res, next) {
  res.render('xem-chi-tiet', { title: 'EleFind-Xem chi tiết' });
});
router.get('/danh-sach-san-pham-theo-loai/', function(req, res, next) {
  res.render('danh-sach-san-pham-theo-loai', { title:'EleFind - Danh sách sản phẩm' });
});
router.get('/tim-kiem/', function(req, res, next) {
  res.render('search', { title: 'EleFind-Tìm kiếm' });
});
router.get('/dang-ky/', function(req, res, next) {
  res.render('signup', { title:'EleFind - Đăng ký tài khoản' });
});

router.get('/dang-nhap/', function(req, res, next) {
  res.render('signin', { title:'EleFind - Đăng ký tài khoản' ,customStyleSheet:'stylesheets/signin.css'});
});

router.get('/cap-nhat-tai-khoan/', function(req, res, next) {
  res.render('updateinfo', { title:'EleFind - Cập nhật tài khoản' });
});
router.get('/cntk/', function(req, res, next) {
  res.render('updateinfo', { title:'EleFind - Cập nhật tài khoản' });
});
module.exports = router;
