
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
    const query = {};

    if(category&&category!=='all') query.category = category;

    if(search) query.name = {$regex: search, $options: "$i"};

    const result = {};
    return await dbs.production.collection(PRODUCTS).find(query).toArray();
};
exports.search = async(category, search, page, pageSize,order) => {
    const query = {};

    if(category&&category!=='all') query.category = category;

    if(search) query.name = {$regex: search, $options: "$i"};

    const result = {};
    result.page = page;
    result.pageSize = pageSize;
    result.size =  await dbs.production.collection(PRODUCTS).find(query).count();

    // init sort
    let sort;
    switch (order) {
        case 'nameasc': sort = {name : 1};break;
        case 'namedesc': sort = {name: -1}; break;
        case 'newest':sort ={_id:1};break;
        case 'eldest':sort={_id:-1};break;
       // case 'priceasc' : sort ={price: 1};break;
      //  case 'pricedesc' :sort ={price :-1};break;
    }

    result.products = await dbs.production.collection(PRODUCTS).find(query).sort(sort).skip((pageSize*page)-pageSize).limit(pageSize).toArray();
    return result;
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

exports.all_by_page = async (page,perPage) => {
    const result = {};
    result.count = await dbs.production.collection(PRODUCTS).find({}).count();
    result.page = page;
    result.perPage = perPage;

    result.data = await (dbs.production
        .collection(PRODUCTS)
        .find({})
        .skip((perPage*page)-perPage).limit(perPage).toArray());
    return result;
};

exports.all_reviews = async (productID) => {
   return  await dbs.production.collection('reviews').find({product_id: productID}).toArray();
};

exports.get_rating = async (productID) => {
    const result = {};
    result.reviews_count = 0;
    result.stars = {};
    for(let i = 1;i<=5;i++) {
            result.stars[''+i].count = 0;
            result.stars[''+i].percent = 0;
    }

    for(let i = 1;i<=5;i++) {

    }


    result.count = await dbs.production.collection(PRODUCTS).find({}).count();
    result.page = page;
    result.perPage = perPage;

    result.data = await (dbs.production
        .collection(PRODUCTS)
        .find({})
        .skip((perPage*page)-perPage).limit(perPage).toArray());
    return result;
};

exports.all_reviews_by_page = async (productID,page,perPage) => {
    const result = {};
    result.count = await dbs.production.collection('reviews').find({}).count();
    result.page = page;
    result.perPage = perPage;

    result.data = (await dbs.production
        .collection('reviews')
        .find({product_id:productID})
        .skip((perPage*page)-perPage).limit(perPage)).toArray();
    return result;
};

exports.all_old_product = async () => {
    return await dbs.production.collection('product').find({}).toArray();
};

exports.query_by_category = async (category) => {
    return await dbs.production.collection(PRODUCTS).find({category: category}).toArray();
};

exports.insertArrayOfDoc = async (data) => {
    console.log('data length :'+data.length);
     await dbs.production.collection(PRODUCTS).insertMany(data);
};

exports.set_data = async (data) => {
    await dbs.production.collection(PRODUCTS).deleteMany({});
    await dbs.production.collection(PRODUCTS).insertMany(data);
};
exports.override_data_to_collection = async (collection,data) => {
    if(data.length>0) {
        await dbs.production.collection(collection).deleteMany({});
        await dbs.production.collection(collection).insertMany(data);
    }
};

exports.update_data_to_collection = async (collection,data) => {
  for(let i = 0;i<data.length;i++)
      await dbs.production.collection(collection).update({id:data[i].id},data[i]);
};

exports.all = all;