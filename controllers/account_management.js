
exports.home = function(req,res,next) {
    if(!req.user) res.redirect('/dang-nhap');
    else {
        const data = {};
        data.editable = false;
        data.user = req.user;
        res.render('account/update_info', {title: 'Tài khoản của tôi', data});
    }
};

exports.update_info = function(req, res, next) {
    if(!req.user) res.redirect('/dang-nhap');
    else {
        const data = {};
        data.editable = true;
        data.user = req.user;
        res.render('account/update_info', {title: 'EleFind - Cập nhật tài khoản'});
    }
};