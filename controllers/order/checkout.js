exports.checkout =  function(req, res, next) {
    res.render('order/checkout', { title:'Quản lý đơn hàng' });
};