'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carritoSchema = ({
    productos : [{type: Schema.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Cart', carritoSchema);