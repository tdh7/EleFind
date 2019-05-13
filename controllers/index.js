var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử';

exports.home = function(req, res, next) {
    res.render('home/index', { title: app_name });
};
