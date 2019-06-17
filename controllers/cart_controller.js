const userDb = require('../models/user');
exports.home = async function(req, res, next) {
    /*  let fs = require('fs');
      let path = process.cwd();
      let buffer = fs.readFileSync(path + "/public/csslink/index.hbs");*/
    res.render('order/cart', { title: 'Quản lý giỏ hàng',customStyleSheet:'/stylesheets/index.css' });

};

exports.add_to_cart = async (req,res,next) => {
    const data = {};
    const product_id = req.body.product_id;
    data.isSignIn = !!(req.user);
    data.result = 'do_nothing'; // mean do nothing
    if(data.isSignIn) {
        let user = req.user;
        user = await userDb.get(user.email);
        let cart = user.cart;;
        if(!cart) {
            cart = [];
        }
        let existed = false;

        for(let i = 0 ; i<cart.length;i++) {
            if (cart[i].product_id === product_id) {
                cart.splice(i);
                data.result='removed';
                existed = true;
                break;
            }
        }

        if(!existed) {
            const pCart = {};
            pCart.product_id = product_id;
            pCart.count = 1;
            cart.push(pCart);
            data.result='added';
        }

            await userDb.save_cart(user.email,cart);
    }

    res.send(data);

};