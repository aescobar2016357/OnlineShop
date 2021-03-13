'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    stock: Number,
    price: Number,
    sold: Number
})

module.exports = mongoose.model('Product', productSchema);

//becas.fundacionjbg.org