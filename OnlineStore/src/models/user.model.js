'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
    user: String,
    pass: String,
    rol: String,
})

module.exports = mongoose.model("User", userSchema)