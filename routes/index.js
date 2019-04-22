var express = require('express');
var router = express.Router();

var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: app_name });
});

router.get('/thong-tin-gio-hang', function(req, res, next) {
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


