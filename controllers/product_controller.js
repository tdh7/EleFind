const product = require('../models/product');
const categoriesDb = require('../models/category');
const brandsDb = require('../models/brand');
const Util = require('../helpers/util');

exports.home = async function(req, res, next) {
    let search = req.query.timkiem;
    let category = req.query.danhmuc;

    let pageSize = Number.parseInt(req.query.pagesize);
    if(!pageSize) pageSize = 20;
    console.log('pagesize = ' + req.query.pagesize);
    let page = Number.parseInt(req.query.page);
    if(!page) page = 1;
    const order = req.query.order;

    const data = {
        products: []
    };

    data.search = search;
    data.category = category;
    data.page = page;
    data.pagesize = pageSize;
    const result = await product.search(category,search,page,pageSize,order);
    data.products = result.products;
    data.size = result.size;
    data.order = order;
    data.pageCount = Math.ceil(data.size / data.pagesize);
    const pagination = {
        page: data.page,       // The current page the user is on
        pageCount: data.pageCount  // The total number of available pages
    };

    data.allCategories = await categoriesDb.all();
    data.allBrands = await brandsDb.all();


    console.log("pagesize after = "+data.pagesize+', total size = '+ data.pageCount);
    if(req.user) {
        data.user = req.user;
    }

    res.render('product/list', { title:'EleFind - Danh sách sản phẩm',data,pagination });
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
        if(data.product.image) data.product.image = Util.getOriginalImages(data.product.image);
        res.render('product/detail', {title: 'Elefind - Danh sách sản phẩm', data});
    } else {
        res.render('error', { customStyleSheet:'stylesheets/error.css' });
    }


};