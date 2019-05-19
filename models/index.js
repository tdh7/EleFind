const { dbs } = require('../dbs');

exports.all = async() => {
    return await dbs.production.collection('index').find({}).toArray();
};

exports.top_categories = async () => {
    const arr = await dbs.production.collection('index').find({name:'top_categories'}).toArray();
    return arr[0];
};

exports.products_sections = async () => {
    const arr = await dbs.production.collection('index').find({name:'products_sections'}).toArray();
    return arr[0];
};
