'use strict'

const express=require("express");
const categoryController=require("../controllers/category.controller")

var authentication=require("../middlewares/authenticated");

var api=express.Router();
api.post("/createCategory/", categoryController.createCategory);
api.put("/editCategory/:idCategory", categoryController.editCategory);
api.delete("/deleteCategory/:idCategory", categoryController.deleteCategory)

module.exports=api;