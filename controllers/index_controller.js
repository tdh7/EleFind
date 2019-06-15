var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử';
const product = require('../models/product');
const index = require('../models/index');
const userModel = require('../models/user');
const passport = require('passport');
const Util = require('../helpers/util');

exports.home = async(req, res, next) => {
    let data = {
        top_categories : []
    };

    let topCategoriesDocument = await index.top_categories();
    console.log("index_controller : get topCategoriesDoc : "+ topCategoriesDocument);
    let topCategoriesArray = topCategoriesDocument.categories;

  //  console.log("index_controller : get top categories : "+ topCategoriesArray);

    for (let i=0;i < topCategoriesArray.length; i++) {
    //    console.log("index_controller : getting data for " + topCategoriesArray[i].category);
        const products = await product.query_by_category(topCategoriesArray[i].category);
    //    console.log("index_controller : getting image "+products[0].image);
        topCategoriesArray[i].image = products[0].image;
        if(topCategoriesArray[i].image) topCategoriesArray[i].image = Util.getOriginalImages(topCategoriesArray[i].image);
    }
    data.top_categories = topCategoriesArray;
    data.products_sections =  await get_products_sections();

    if(req.user) {
        data.user = req.user;
    }
    res.render('home/index', { title: app_name, data});
};

const get_products_sections = async () => {
    let sectionsDocument = await index.products_sections();
  //  console.log("get_products_sections : "+sectionsDocument);
    let sections = sectionsDocument.sections;
  //  console.log("get_products_sections : "+sections);

    for(let i = 0;i <sections.length;i++) {
   //     console.log("section : "+sections[i].name);
        const section = sections[i];
        const products = section.products;
        for(let j = 0; j < products.length;j++) {
            let id = products[j];
        //    console.log("getting product "+id);
            sections[i].products[j] = await product.find_product_by_id(id);
         //   console.log("getting product "+sections[i].products[j].name);
        }
    }
    return sections;
};

exports.loginGet = (req,res,next) => {
    if(req.user)
        res.redirect('/');
    else {
        const data = {};
        data.isSignInPage = true;
        res.render('account/sign_in', {title: 'Đăng nhập', customStyleSheet: '/stylesheets/signin.css',data});
    }
};

exports.registerGet = (req,res) => {
    if(req.user)
        res.redirect('/');
    else {
        const data = {};
        data.isSignUpPage = true;
        res.render('account/sign_up', {title: 'Đăng ký',data})
    }
};

exports.accountRecovery = (req,res) => {
    if(req.user)
        res.redirect('/');
    else {
        res.render('account/account_recovery', {title: 'Khôi phục mật khẩu'})
    }
};

exports.registerPost = async (req,res, next) => {
    const user = await userModel.get(req.body.email);
    if(user) {
        const data ={};
        data.cache = req.body;
        data.error = 'Địa chỉ email đã được sử dụng';
        return res.render('account/sign_up',{title:'Elefind - Đăng ký tài khoản',data});
    }
    const newUser = {};
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.address = req.body.address;
    newUser.city = req.body.city;
    newUser.country = req.body.country;
    newUser.phone = req.body.phone;
    const returnUser = await userModel.register(newUser);

    if(returnUser) {
        passport.authenticate('local', (err, newUser) => {
            req.logIn(newUser, (errLogIn) => {
                if (errLogIn) {
                   console.log('fail to login : '+ errLogIn);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }
    else {
        const data ={};
        data.cache = req.body;
        data.error = 'Xin lỗi, hệ thống không thể tạo tài khoản cho bạn, vui lòng thử lại :/';
        return res.render('account/sign_up',{title:'Elefind - Đăng ký tài khoản',data});
    }
};

exports.logout = (req,res) => {
    req.logout();
    res.redirect('/');
};

const rp = require('request-promise');
const $ = require('cheerio');

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