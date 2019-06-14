
const ObjectId = require('mongodb').ObjectId;
const { dbs } = require('../dbs');

const PRODUCTS = 'products';

exports.find_product_by__object_id = async (id) => {
    const results = await dbs.production.collection(PRODUCTS).find({_id: ObjectId(id)})
        .toArray();
    return results[0];
};

exports.search_by_name = async (search) => {
    return await dbs.production.collection(PRODUCTS).find({name: {$regex: search, $options: "$i"}}).toArray();
};

exports.search_by_category_and_name = async(category, search) => {
    return await dbs.production.collection(PRODUCTS).find({category: category, name: {$regex: search, $options: "$i"}}).toArray();
};

exports.find_product_by_category_and_id = async (category, productId) => {
  const  result = await  dbs.production.collection(PRODUCTS).find({id:productId})
      .toArray();
  return result[0];
};

exports.find_product_by_id = async (productId) => {
    const  result = await dbs.production.collection(PRODUCTS).find({id:productId})
        .toArray();
    return result[0];
};

const all = async() => {
    return await dbs.production.collection(PRODUCTS).find({}).toArray();
};

exports.all_old_product = async () => {
    return await dbs.production.collection('product').find({}).toArray();
};

exports.query_by_category = async (category) => {
    return await dbs.production.collection(PRODUCTS).find({category: category}).toArray();
};

exports.insertArrayOfDoc = async (data) => {
    console.log('data length :'+data.length);
     await dbs.production.collection('products').insertMany(data);
};

exports.all = all;