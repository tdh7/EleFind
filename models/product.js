
const ObjectId = require('mongodb').ObjectId;
const { dbs } = require('../dbs');

function productCollection() {
    return dbs.production.collection('product');
}

exports.find_product_by__object_id = async (id) => {
    const results = await dbs.production.collection('product').find({_id: ObjectId(id)})
        .toArray();
    return results[0];
};

exports.search_by_name = async (search) => {
    return await dbs.production.collection('product').find({name: {$regex: search, $options: "$i"}}).toArray();
};

exports.search_by_category_and_name = async(category, search) => {
    return await dbs.production.collection('product').find({category: category, name: {$regex: search, $options: "$i"}}).toArray();
};

exports.find_product_by_category_and_id = async (category, productId) => {
  const  result = await  dbs.production.collection('product').find({id:productId})
      .toArray();
  return result[0];
};

exports.find_product_by_id = async (productId) => {
    const  result = await dbs.production.collection('product').find({id:productId})
        .toArray();
    return result[0];
};

const all = async() => {
    return await dbs.production.collection('product').find({}).toArray();
};

exports.query_by_category = async (category) => {
    return await dbs.production.collection('product').find({category: category}).toArray();
};

exports.all = all;