
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const {dbs} = require("../dbs");

const USER = 'user';
const SALT_ROUNDS = 10;

exports.verify = async (username,password) => {
	const user = await dbs.production.collection(USER).findOne({email:username});
	if(!user) {
		console.log('User Not Found with username'+ username);
		return undefined;
	}
	// verify password

	return results[0];
};

const findUserByEmail = async (email) => {
	return await dbs.production.collection(USER).findOne({email});
};


exports.register = async (user) => {
	if(!user.email) return undefined;
	if(!user.password) return undefined;

	const hash = await bcrypt.hash(user.password,SALT_ROUNDS);
	const model = {};
	model.email = user.email;
	model.password = hash;

	model.firstName =(user.firstName) ? user.firstName: "";
	model.lastName = (user.lastName) ? user.lastName : "";
	model.address = (user.address) ? user.address : "";
	model.city = (user.city) ? user.city : "";
	model.country = (user.country) ? user.country : "Việt Nam";
	model.phone = (user.phone) ? user.phone : "";
	model.historyOrders = [];
	model.wishList = [];
	model.cart = [];
	model.balance = 0;
	return await dbs.production.collection(USER).insertOne(model);
};

exports.addToCart = async (email,productID) => {
	const user =  await findUserByEmail(email);
	if(!user) return undefined;

	let cart = user.cart;

	if(!cart) cart = [];

	if(cart.indexOf(productID) ===-1) {
		cart.push(productID);
	}

	return await dbs.production.collection(USER).save({email: email},{cart : cart});
};

exports.saveUser = async(user) => {
	if(!user.email) return undefined;
	if(!user.password) return undefined;

	const hash = await bcrypt.hash(user.password,SALT_ROUNDS);
	const model = {};
	model.email = user.email;
	model.password = hash;

	model.firstName =(user.firstName) ? user.firstName: "";
	model.lastName = (user.lastName) ? user.lastName : "";
	model.address = (user.address) ? user.address : "";
	model.city = (user.city) ? user.city : "";
	model.country = (user.country) ? user.country : "Việt Nam";
	model.phone = (user.phone) ? user.phone : "";
	model.historyOrders = [];
	model.wishList = [];
	model.cart = [];
	model.balance = 0;
	return await dbs.production.collection(USER).update({email:model},model);
};

exports.validPassword = async (email,password) => {
	const hash = await bcrypt.hash(password,SALT_ROUNDS);
	const user = await findUserByEmail(email);
	if(!user) return false;
	return await bcrypt.compare(password,user.password);
};

exports.get = findUserByEmail;