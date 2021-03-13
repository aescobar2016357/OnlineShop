'use strict'

//Variables globales
const express=require("express");
const app = express();
const bodyParser=require("body-parser");
const cors=require("cors");

//Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Importación rutas  
const user_Route = require("./src/routes/user.routes");
const category_Route = require("./src/routes/category.routes");
const product_Route = require("./src/routes/product.routes");

//Cargar de rutas 
app.use("/apiUser", user_Route);
app.use("/apiCategory", category_Route);
app.use("/apiProduct",product_Route);

//Exportar
module.exports=app;