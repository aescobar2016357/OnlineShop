'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
    name: String,
    product: [{type: Schema.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Category', CategorySchema);