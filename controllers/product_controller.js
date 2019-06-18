const product = require('../models/product');
const categoriesDb = require('../models/category');
const brandsDb = require('../models/brand');
const Util = require('../helpers/util');
// Get a Handlebars instance
const hb = require("handlebars");
const helpers = require('../helpers/handlebars');
helpers.register(hb);
// Load a template
const fs = require('fs');

exports.home = async function (req, res, next) {
    let search = req.query.timkiem;
    let category = req.query.danhmuc;
    let brand = req.query.brand;
    let price_min = req.query.price_min;
    let price_max = req.query.price_max;

    let pageSize = Number.parseInt(req.query.pagesize);
    if (!pageSize) pageSize = 20;
    console.log('pagesize = ' + req.query.pagesize);
    let page = Number.parseInt(req.query.page);
    if (!page) page = 1;
    const order = req.query.order;

    const data = {
        products: []
    };


    data.search = search;
    data.category = category;
    data.price_min = price_min;
    data.price_max = price_max;
    data.brand = brand;
    data.page = page;
    data.pagesize = pageSize;
    const result = await product.search_detail(category, brand, price_min, price_max, search, page, pageSize, order);
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


    console.log("pagesize after = " + data.pagesize + ', total size = ' + data.pageCount);
    if (req.user) {
        data.user = req.user;
    }

    res.render('product/list', { title: 'EleFind - Danh sách sản phẩm', data, pagination });
};

exports.product_detail = async (req, res, next) => {
    var category = req.params.category;
    var productId = req.params.productId;
    var review_page = Number.parseInt(req.query.rvpage);
    if (!review_page) review_page = 1;
    const review_per_page = Number.parseInt(req.query.limit) | 5;
    const data = {
        product
    };
    if (req.user) {
        data.user = req.user;
    }

    console.log("receive category = " + category + ", product_id = " + productId);
    const result = await product.find_product_by_category_and_id(category, productId);
    if (result) {
        data.product = result;
        if (data.product.image) data.product.image = Util.getOriginalImages(data.product.image);

        // get reviews;
        // const [review_data, similarProduct] = await Promise.all([
        //     product.all_reviews(Number.parseInt(data.product.id)),
        //     product.loadProductbyCategory(category, 4, +productId)])
        const review_data = await product.all_reviews(Number.parseInt(data.product.id));
        data.dm = await product.loadProductbyCategory(category, 3, productId);
        console.log(data.dm);
        data.product.review = {
            stars: {
                "1": {
                    count: 0,
                    percent: 0
                },
                "2": {
                    count: 0,
                    percent: 0
                },
                "3": {
                    count: 0,
                    percent: 0
                },
                "4": {
                    count: 0,
                    percent: 0
                },
                "5": {
                    count: 0,
                    percent: 0
                },
            },
            rating_average: 0,
            review_count: review_data.length,
        };
        let sum = 0;

        for (let i = 0; i < review_data.length; i++) {
            data.product.review.stars['' + review_data[i].rating].count++;
            sum += review_data[i].rating;
        }
        for (let i = 1; i <= 5; i++) {
            data.product.review.stars['' + i].percent = Math.round(data.product.review.stars['' + i].count / data.product.review.review_count * 100);
        }

        data.product.review.rating_average = Math.round(10 * sum / review_data.length) / 10;
        data.product.review.data = Util.paginate(review_data, review_per_page, review_page);

        data.reviewPageCount = Math.ceil(review_data.length / review_per_page);
        const pagination = {
            page: review_page,       // The current page the user is on
            pageCount: data.reviewPageCount  // The total number of available pages
        };

        res.render('product/detail', { title: 'Elefind - Danh sách sản phẩm', data, pagination });
    } else {
        res.render('error', { customStyleSheet: 'stylesheets/error.css' });
    }

};

exports.get_review = async (req, res, next) => {
    var category = req.params.category;
    var productId = req.params.productId;
    var review_page = Number.parseInt(req.query.rvpage);
    if (!review_page) review_page = 1;
    const review_per_page = Number.parseInt(req.query.limit) | 5;

    const json = {};
    const data = {};
    data.product = {};

    const review_data = await product.all_reviews(Number.parseInt(productId));
    data.product.review = {};
    data.product.review.data = Util.paginate(review_data, review_per_page, review_page);

    data.reviewPageCount = Math.ceil(review_data.length / review_per_page);
    const pagination = {
        page: review_page,       // The current page the user is on
        pageCount: data.reviewPageCount  // The total number of available pages
    };
    json.data = data;
    var template = fs.readFileSync('./public/htm/review.html', 'utf8');

    // Compile said template
    var compiled = hb.compile(template);
    var html = compiled({ data, pagination });
    res.send(html);

};

