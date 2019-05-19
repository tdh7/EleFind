var app_name = 'EleFind - Mua sắm điện thoại, máy tính và các thiết bị điện tử';
const product = require('../models/product');
const index = require('../models/index');

exports.home = async(req, res, next) => {
    let data = {
        top_categories : []
    };

    let topCategoriesDocument = await index.top_categories();
    console.log("index_controller : get topCategoriesDoc : "+ topCategoriesDocument);
    let topCategoriesArray = topCategoriesDocument.categories;

    console.log("index_controller : get top categories : "+ topCategoriesArray);

    for (let i=0;i < topCategoriesArray.length; i++) {
        console.log("index_controller : getting data for " + topCategoriesArray[i].category);
        const products = await product.query_by_category(topCategoriesArray[i].category);
        console.log("index_controller : getting image "+products[0].image);
        topCategoriesArray[i].image = products[0].image;
    }
    data.top_categories = topCategoriesArray;
    data.products_sections =  await get_products_sections();


    res.render('home/index', { title: app_name, data});
};

const get_products_sections = async () => {
    let sectionsDocument = await index.products_sections();
    console.log("get_products_sections : "+sectionsDocument);
    let sections = sectionsDocument.sections;
    console.log("get_products_sections : "+sections);

    for(let i = 0;i <sections.length;i++) {
        console.log("section : "+sections[i].name);
        const section = sections[i];
        const products = section.products;
        for(let j = 0; j < products.length;j++) {
            let id = products[j];
            console.log("getting product "+id);
            sections[i].products[j] = await product.find_product_by_id(id);
            console.log("getting product "+sections[i].products[j].name);
        }
    }
    return sections;
};