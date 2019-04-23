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

router.get('/quen-mat-khau/', function(req, res, next) {
  res.render('forgotpassword', { title:'EleFind - Lấy lại mật khẩu' });
});

router.get('/thong-tin-don-hang', function(req, res, next) {
  res.render('checkout', { title: app_name });
});


router.get('/quan-ly-gio-hang', function(req, res, next) {
/*  let fs = require('fs');
  let path = process.cwd();
  let buffer = fs.readFileSync(path + "/public/csslink/cart.hbs");*/
  res.render('cart', { title: app_name,customStyleSheet:'stylesheets/cart.css' });

});

router.get('/lich-su-mua-hang', function(req, res, next) {
    /*  let fs = require('fs');
      let path = process.cwd();
      let buffer = fs.readFileSync(path + "/public/csslink/cart.hbs");*/
    res.render('historycart', { title: app_name,customStyleSheet:'stylesheets/cart.css' });

});

module.exports = router;


