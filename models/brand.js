const ObjectId = require('mongodb').ObjectId;
const { dbs } = require('../dbs');

exports.all = async() => {
    return await dbs.production.collection('brand').find({}).toArray();
};

exports.find_brand_by_displayName = async (displayName) => {
    return (await dbs.production.collection('brand').find({displayName : displayName}).toArray())[0];
};

exports.find_brand_by_id = async (id) => {
    return (await dbs.production.collection('brand').find({id : id}).toArray())[0];
};
exports.add = async (data) => {
    return await dbs.production.collection('brand').insertOne(data);
};

exports.edit = async (objectId,data) => {
    return await dbs.production.collection('brand').update({_id: ObjectId(objectId)},data);
};

exports.delete = async (objectId) => {
    return await dbs.production.collection('brand').deleteOne({_id:ObjectId(objectId)});
};

exports.delete_by_display_name = async (brand) => {
    return await dbs.production.collection('brand').deleteOne({displayName:brand});
};