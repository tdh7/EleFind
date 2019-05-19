
exports.sign_in = function(req, res) {
  //  res.render('order/historycart', { title: app_name,customStyleSheet:'stylesheets/index.css' });
    res.render('account/sign_in', { title:'EleFind - Đăng nhập tài khoản' ,customStyleSheet:'/stylesheets/signin.css'});
};