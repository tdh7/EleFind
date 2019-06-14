const product = require('../models/product');


exports.home = async function(req, res, next) {
    let category = req.query.danhmuc;
    if(category==='all') category = undefined;

    let search = req.query.timkiem;

    const data = {
        products: []
    };

    data.search = search;
    data.category = category;
    if(search) {


        if(category) data.products = await product.search_by_category_and_name(category,search);
        else data.products = await product.search_by_name(search);
    }
    else if(category) data.products = await product.query_by_category(category);
    else data.products = await product.all();

    if(req.user) {
        data.user = req.user;
    }

    res.render('product/product_all', { title:'EleFind - Danh sách sản phẩm',data });
};

exports.product_detail = async (req,res,next) => {
  var category = req.params.category;
  var productId = req.params.productId;

    const data = {
        product
    };
    if(req.user) {
        data.user = req.user;
    }

    console.log("receive category = " + category + ", product_id = " + productId);
    const result = await product.find_product_by_category_and_id(category,productId);
    if(result) {
        data.product = result;
        res.render('product/detail', {title: 'Elefind - Danh sách sản phẩm', data});
    } else {
        res.render('error', { customStyleSheet:'stylesheets/error.css' });
    }


};