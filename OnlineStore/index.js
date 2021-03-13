'use strict'

const mongoose = require("mongoose");
const userModel = require('./src/models/user.model');
const categoryModel = require('./src/models/category.model')
const bcrypt = require("bcrypt-nodejs");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/onlineStore", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se encuentra conectado a la Base de Datos");
    app.listen(3002, function () {
        console.log("El Servidor esta arracando en el puerto 3000");
        
        var usuarioM = new userModel();
        var category = new categoryModel();

        userModel.find({ usuario: usuarioM.user }).exec((err, usuarioEncontrado) => {
            if (usuarioEncontrado && usuarioEncontrado.length >= 1){ 
                return console.log('El usuario ya existe')
            }else{
                usuarioM.user = 'ADMIN';
                usuarioM.pass = '123456';
                usuarioM.rol = 'ADMIN';
                bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
                    usuarioM.pass = passwordEncriptada
                    usuarioM.save((err, usuarioGuardado) => {
                        if (err) return console.log('Error Guardando')
        
                        if (usuarioGuardado) {
                            return console.log(usuarioGuardado)
                        } else {
                            return console.log('Error')
                        }
                    })
                })
            }
        })

        categoryModel.find({
            $or: [
                { name: "default" }
            ]
        }).exec((err, categoryFound) => {
            if (err) console.log("Error en la petición");

            if (categoryFound && categoryFound.length >= 1) {
                console.log("Ya existe la categoria Default");
            } else {
                category.name = "default";
                category.save((err, saveCategory) => {
                    if (saveCategory) {
                        console.log("La categoria Default a sido creado")
                    }
                })
            }
        })
    })
}).catch(err => console.log(err)); 
