
exports.home =  function(req, res, next) {
    const data = {};
    if (!req.user) {
        res.redirect('/dang-nhap?redirect=lich-su-mua-hang');
    } else {
        data.user = req.user;
        res.render('order/historycart', {title: 'Lịch sử mua hàng', customStyleSheet: '/stylesheets/index.css',data});
    }
};