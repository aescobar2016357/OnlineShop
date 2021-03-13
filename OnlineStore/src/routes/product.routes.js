'use strict'

const express=require("express");
const productController=require("../controllers/product.controller")

var authentication=require("../middlewares/authenticated");

var api=express.Router();
api.post("/createProduct/", productController.createProduct);
api.put("/editProduct/:idProduct", productController.editProduct);
api.delete("/deleteProduct/:idProduct", productController.deleteProduct);
api.get("/searchProductName/", productController.searchProductByName);
module.exports=api;
