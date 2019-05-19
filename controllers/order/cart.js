
exports.cart = function(req, res, next) {
    /*  let fs = require('fs');
      let path = process.cwd();
      let buffer = fs.readFileSync(path + "/public/csslink/index.hbs");*/
    res.render('order/cart', { title: 'Quản lý giỏ hàng',customStyleSheet:'/stylesheets/index.css' });

};