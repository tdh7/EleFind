const ObjectId = require('mongodb').ObjectId;
const { dbs } = require('../dbs');

exports.all = async() => {
    return await dbs.production.collection('category').find({}).toArray();
};

exports.find_category = async (category) => {
    return await dbs.production.collection('category').find({category : category}).toArray()[0];
};
