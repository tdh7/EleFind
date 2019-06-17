const userDb = require('../models/user');
const productDb = require('../models/product');
exports.home = async function(req, res, next) {
    const data = {};
    if(!req.user) {
        res.redirect('dang-nhap?redirect=gio-hang');
    } else {
        data.user = req.user;
        let user = await  userDb.get(req.user.email);
        data.cart = user.cart;
        if(!data.cart) {
            data.cart = [];
        }
        data.price = 0;
        for(let i=0;i<data.cart.length;i++) {
            data.cart[i].product = await productDb.find_product_by_id(data.cart[i].product_id);
            data.cart[i].priceTotal=data.cart[i].product.priceValue * data.cart[i].count;
            data.price += data.cart[i].priceTotal;
        }

        res.render('order/cart', {title: 'Quản lý giỏ hàng', customStyleSheet: '/stylesheets/index.css', data});
    }
};
exports.check_existed_cart = async (req,res,next) => {
    const data= {};
    const product_id = req.body.product_id;
    data.isSignIn = !!(req.user);
    data.result = 'do_nothing'; // mean do nothing
    data.exist = false;
    if(data.isSignIn) {
        let user = await  userDb.get(req.user.email);
        if(!user.cart) data.exist = false;
        else for(let i = 0 ; i<user.cart.length;i++) {
            if (user.cart[i].product_id === product_id) {
                data.exist = true;
            }
        }
    }
    res.send(data);
};

exports.remove = async (req,res,next) => {
    const data = {};
    const product_id = req.body.product_id;
    data.isSignIn = !!req.user;
    data.result = 'no_thing';
    if(data.isSignIn) {
        let user = req.user;
        user = await userDb.get(user.email);
        let cart = user.cart;
        if(!cart) cart = [];
        let existed = false;
        for(let i=0;i< cart.length;i++) {
            if (cart[i].product_id === product_id) {
                cart.splice(i,1);
                data.result='removed';
                existed = true;
                break;
            }
        }
        data.price = 0;
        data.cart = cart;
        for(let i=0;i<data.cart.length;i++) {
            data.cart[i].product = await productDb.find_product_by_id(data.cart[i].product_id);
            data.cart[i].priceTotal=data.cart[i].product.priceValue * data.cart[i].count;
            data.price += data.cart[i].priceTotal;
        }

        await userDb.save_cart(user.email,cart);
        data.result = 'success';
    }
    res.send(data);
};

exports.minus = async (req,res,next) => {
    const data = {};
    const product_id = req.body.product_id;
    data.isSignIn = !!req.user;
    data.result = 'no_thing';
    if(data.isSignIn) {
        let user = req.user;
        user = await userDb.get(user.email);
        let cart = user.cart;
        if(!cart) cart = [];
        let existed = false;

        for(let i=0;i< cart.length;i++) {
            if (cart[i].product_id === product_id) {
                if(cart[i].count>1)
                    cart[i].count--;
                data.count = cart[i].count;
                existed = true;
                break;
            }
        }
        data.price = 0;
        data.cart = cart;
        for(let i=0;i<data.cart.length;i++) {
            data.cart[i].product = await productDb.find_product_by_id(data.cart[i].product_id);
            data.cart[i].priceTotal=data.cart[i].product.priceValue * data.cart[i].count;

            if(data.cart[i].product_id===product_id) data.thisPrice = data.cart[i].priceTotal;

            data.price += data.cart[i].priceTotal;
        }


        await userDb.save_cart(user.email,cart);
        data.result = 'success';
    }
    res.send(data);

};

exports.plus = async (req,res,next) => {
  const data = {};
  const product_id = req.body.product_id;
  data.isSignIn = !!req.user;
  data.result = 'no_thing';
  if(data.isSignIn) {
      let user = req.user;
      user = await userDb.get(user.email);
      let cart = user.cart;
      if(!cart) cart = [];
      let existed = false;
      for(let i=0;i< cart.length;i++) {
          if (cart[i].product_id === product_id) {
              cart[i].count++;
              data.count = cart[i].count;
              data.thisCart = cart[i];
              existed = true;
              break;
          }
      }

      if(!existed) {
          const pCart = {};
          pCart.product_id = product_id;
          pCart.count = 1;
          data.count = 1;
          cart.push(pCart);
          data.result='added';
      }
      data.price = 0;
      data.cart = cart;
      for(let i=0;i<data.cart.length;i++) {
          data.cart[i].product = await productDb.find_product_by_id(data.cart[i].product_id);
          data.cart[i].priceTotal=data.cart[i].product.priceValue * data.cart[i].count;

          if(data.cart[i].product_id===product_id) data.thisPrice = data.cart[i].priceTotal;

          data.price += data.cart[i].priceTotal;
      }

      await userDb.save_cart(user.email,cart);
      data.result = 'success';
  }
  res.send(data);

};

exports.add_to_cart = async (req,res,next) => {
    const data = {};
    const product_id = req.body.product_id;
    let command = req.body.command;
    if(!command) command ='add_or_remove'; // add_or_remove, minus, plus
    data.isSignIn = !!(req.user);
    data.result = 'do_nothing'; // mean do nothing
    if(data.isSignIn) {
        let user = req.user;
        user = await userDb.get(user.email);
        let cart = user.cart;
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
        data.cart = cart;
    }

    res.send(data);

};