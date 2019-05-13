var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Product = new Schema(
    {
    Title :String,
     Star : Number,
    Price : Number,

    }
    );