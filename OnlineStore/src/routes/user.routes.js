"use strict"

const express=require("express");
const userController=require("../controllers/user.controller")

var authentication=require("../middlewares/authenticated");

var api=express.Router();
api.post("/register", userController.register);
api.post("/login", userController.login);
api.put("/editUser/:idUser",userController.editClient);
api.put("/deleteUser/:idUser",userController.deleteClient);

module.exports=api;