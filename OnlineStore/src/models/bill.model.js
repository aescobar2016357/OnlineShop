'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BillSchema = Schema({
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    products:[{
        productId: {type: Schema.Types.ObjectId, ref: 'Product'},
        amount: Number,
        subTotal: Number
    }],
    total: Number
})

module.exports = mongoose.model('Bill', BillSchema);