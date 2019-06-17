const rp = require('request-promise');
const $ = require('cheerio');
var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử';
const product = require('../models/product');
const index = require('../models/index');
const userModel = require('../models/user');
const passport = require('passport');
const Util = require('../helpers/util');



exports.parseWebsite = async (req,res,next) => {

    const data = [];
    const base = 'https://tiki.vn/phu-kien-may-tinh-va-laptop/c28670';
    for(let page = 1;page <= 3;page ++) {
        const url = base +'?page='+page;
        const html = await rp(url);
        //success!

        const list = $('.product-box-list .product-item', html);
        const count = list.length;
        console.log('product count = ' + count);
        console.log('first item ' + list[0].attribs['data-title']);

        for (let i = 0; i < list.length; i++) {
            try {
                const item = {};
                item.id = list[i].attribs['data-id'];
                console.log('id = '+ item.id);
                item.name = list[i].attribs['data-title'];
                console.log('name');

                item.category = 'accessory';
                item.categoryName = 'Phụ kiện';
                item.brand = list[i].attribs['data-brand'];
                console.log('brand');


                item.image = $('.image img', list[i])[0].attribs['src'];
                console.log('image');
                try {
                    item.starRate = $('.rating-content span', list[i])[0].attribs['style'].replace(/[^\d.-]/g, '');
                    item.starRate = parseInt(parseFloat(item.starRate) / 20);
                } catch (e) {
                    console.log('item error : can not get starRate');
                    item.starRate = "3";
                }
                console.log('starRate');

                item.price = //list[i].attribs['data-price'];
                    $('.price-sale .final-price', list[i])[0].children[0].data.trim();
                try {
                    item.oldPrice = $('.price-sale .price-regular', [list[i]])[0].children[0].data.trim();
                } catch (e) {
                    console.log('item error : no old price');
                    item.oldPrice = null;
                }
                item.count = 100;
                data.push(item);
            } catch (e) {
                console.log('for loop error : '+e);
            }
        }

    }
    console.log('finish getting data, length = '+data.length);
    await product.insertArrayOfDoc(data);
    res.redirect('/san-pham?danhmuc='+data[0].category);
};

exports.oldData = async (req,res,next) => {
    const data = await product.all_old_product();
    console.log('add old products = '+data.length);
    await product.insertArrayOfDoc(data);
    res.redirect('/');
};

exports.change_image_size = async  (req,res,next) => {
    const data = await product.all();
    for(let i = 0;i<data.length;i++)
        data[i].image  = Util.getImageBySize(data[i].image,300);
    await product.set_data(data);
    res.redirect('/');
};

exports.normalize = async (req,res,next) => {
    await exports.data_receiver();
    res.redirect('/');
};

exports.data_receiver = async () => {
    const data = {};
    data.productList = [];
    data.brandList = [];
    data.reviews = [];
    await exports.get_data_from_tiki(data,'https://tiki.vn/dien-thoai-smartphone/c1795',4,'smartphone','Điện thoại',300);

    await product.override_data_to_collection('products',data.productList);
    await product.override_data_to_collection('reviews',data.reviews);


    await exports.get_data_from_tiki(data,'https://tiki.vn/may-tinh-bang/c1794',3,'tablet','Máy tính bảng',300);
    await exports.get_data_from_tiki(data,'https://tiki.vn/laptop/c8095',3,'laptop','Máy tính xách tay',300);

    await product.override_data_to_collection('products',data.productList);
    await product.override_data_to_collection('reviews',data.reviews);


    await exports.get_data_from_tiki(data,'https://tiki.vn/thiet-bi-am-thanh-va-phu-kien/c8215',3,'accessory','Phụ kiện',300);

    await product.override_data_to_collection('products',data.productList);
    await product.override_data_to_collection('reviews',data.reviews);


    await exports.get_data_from_tiki(data,'https://tiki.vn/may-anh/c28806',3,'camera','Máy ảnh',300);

    await product.override_data_to_collection('products',data.productList);
    await product.override_data_to_collection('reviews',data.reviews);


    await exports.get_data_from_tiki(data,'https://tiki.vn/ban-phim/c1830',3,'accessory','Phụ kiện',300);

    await product.override_data_to_collection('products',data.productList);
    await product.override_data_to_collection('reviews',data.reviews);

    for(let i = 0; i<data.brandList.length;i++) {
        data.brandList[i] = {
            id:""+(100+i),
            name:data.brandList[i],
            displayName:data.brandList[i]
        }
    }

    await product.override_data_to_collection('brands',data.brandList);
};
exports.parse_detail_product_old = async (product, url) => {
    const html = await rp(url);
    const scripts = $('script',html);
    const imageContent = scripts[26].children[0].data;

    const var1 = 'var images = ';
    const var2 = 'var imageGalery';

    var images = imageContent.match( /var images =(.*)var imageGalery/);

    const imageTags = $('.image-gallery-thumbnail img');
    product.images = [];
    for(let i=0;i<imageTags.length;i++) {
        const image = imageTags[i].attribs['src'];
        product.images.push(image);
    }
    let result;
};

exports.parse_detail_product = async (data, product, url) => {
    const html = await rp(url);

    // get image list
    try {
        product.images = [];
        const imageTags = $('.flx img',html);
    for(let i=0;i<imageTags.length;i++) {
        const image = imageTags[i].attribs['src'];
        if(image)
        product.images.push(Util.getImageBySize(image,300));
    }
        } catch (e) {
        if(product.images.length===0)
        product.images = [item.image];
    }

    // get detail
    const detail= $('#gioi-thieu',html).toString().trim().replace('<p><br><br></p>','');
    product.description = detail;

    // review list, review detail
    const reviewJson = await rp('https://tiki.vn/api/v2/reviews?product_id='+product.id+'&limit=30');
    const review = JSON.parse(reviewJson);
    data.reviews.push(...review.data);
};

exports.get_data_from_tiki = async (data,base,pageCount,category,categoryName,imageSize) => {

    for(let page = 1;page <= pageCount;page ++) {
        const url = base +'?page='+page;
        const html = await rp(url);
        //success!

        const list = $('.product-box-list .product-item', html);
        const count = list.length;
        console.log('product count = ' + count);
        console.log('first item ' + list[0].attribs['data-title']);

        for (let i = 0; i < list.length; i++) {
            try {
                const item = {};
                item.id = list[i].attribs['data-id'];
                console.log('id = '+ item.id);
                item.name = list[i].attribs['data-title'];
                console.log('name');

                item.category =  category;
                item.categoryName = categoryName;
                item.brand = list[i].attribs['data-brand'];

                if(!data.brandList.includes(item.brand)) {
                    data.brandList.push(item.brand);
                }

                console.log('brand ' + item.brand);

                item.image = $('.image img', list[i])[0].attribs['src'];
                console.log('image');


                try {
                const href = $('a',list[i])[0].attribs['href'];
                    await exports.parse_detail_product(data,item,href);
                } catch (e) {
                    console.log('false to get image list : '+ item.name);

                }

                try {
                    item.starRate = $('.rating-content span', list[i])[0].attribs['style'].replace(/[^\d.-]/g, '');
                    item.starRate = parseInt(parseFloat(item.starRate) / 20);
                } catch (e) {
                    console.log('item error : can not get starRate');
                    item.starRate = "3";
                }
                console.log('starRate');

                item.price = //list[i].attribs['data-price'];
                    $('.price-sale .final-price', list[i])[0].children[0].data.trim();

                try {
                    item.priceValue = Number.parseFloat(list[i].attribs['data-price']);
                } catch (e) {
                    var cur_re = /\D*(\d+|\d.*?\d)(?:\D+(\d{2}))?\D*$/;
                    var parts = cur_re.exec(currency);
                    try {
                    item.priceValue = parseFloat(parts[1].replace(/\D/, '') + '.' + (parts[2] ? parts[2] : '00'));
                }catch (e) {

                    }
                }
                try {
                    item.oldPrice = $('.price-sale .price-regular', [list[i]])[0].children[0].data.trim();
                } catch (e) {
                    console.log('item error : no old price');
                    item.oldPrice = null;
                }
                item.count = 100;
                data.productList.push(item);
            } catch (e) {
                console.log('for loop error : '+e);
            }
        }

    }
    console.log('finish getting data, length = '+data.productList.length);
};