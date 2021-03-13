"use strict"

const Category = require("../models/category.model");
const User = require("../models/user.model");

function createCategory(req, res) {
    var categoryModel = new Category();
    var params = req.body;

    if (params.name) {
        categoryModel.name = params.name;
        Category.find({
            $or: [
                { name: categoryModel.name }
            ]
        }).exec((err, categoryFound) => {
            if (err) return res.status(500).send({ mesaje: "Error en la petición" });
            if (categoryFound && categoryFound.length >= 1) {
                return res.status(500).send({ mesaje: "La categoria ya existe" });
            } else {
                categoryModel.save((err, saveCategory) => {
                    if (saveCategory) {
                        res.status(200).send(saveCategory);
                    }
                })
            }
        })
    }
}


function editCategory(req, res) {
    let idCategory = req.params.idCategory;
    var params = req.body;

    /*Category.findByIdAndUpdate(params.idCategory, params, { new: true }, (err, updateCategory) => {
        if (err) return res.status(500).send({ mesaje: "Error en la petición" });
        if (!updateCategory) return res.status(500).send({ mesaje: "No se pudo actualizar la categoria" });
        return res.status(200).send({ updateCategory });
    })*/

    Category.findOne({name:params.name},(err,categoryFound)=>{
        if(err){
            res.status(500).send({message: "Error en el servidor, intentelo más tarde"});
        }else if(categoryFound){
            res.status(200).send({message: "El nombre de usuario ya existente"});
        }else{
            Category.findByIdAndUpdate(idCategory,params,{new:true},(err,categoryUpdate)=>{
                if(err){
                    res.status(500).send({message: "Error en el servidor al intentar actualizar, intentelo más tarde"});
                }else if(categoryUpdate){
                    res.status(200).send({message: "Usuario actualizado exitosamente", categoryUpdate});
                }else{
                    res.status(200).send({message: "No existe el usuario"});
                }
            })
        }
    })

    
}



/*function deleteCategory(req, res) {
    var productModel = new Product();
    var IdUser = req.params.IdUser;
    var params = req.body;

    User.findById(IdUser, (err, userFound) => {
        if (err) return res.status(500).send({ mesaje: "Error al hacer la petición" });
        if (!userFound) { return res.status(500).send({ mesaje: "No posees los permisos necesarios" }) }
        if (userFound.rol === "rol_Admin") {
            Product.find({
                $or: [
                    { idCategoria: params.idCategoria }
                ]
            }).exec((err, obtainedEmployee) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                if (!obtainedEmployee) return res.status(500).send({ mensaje: "no se encontraron empleados" })
                productModel.idCategoria = "Default"
                Category.findByIdAndDelete(params.idCategoria, (err, deleteCategory) => {
                    if (err) return res.status(500).send({ mesaje: "Error en la petición" });
                    if (!deleteCategory) return res.status(500).send({ mesaje: "No se puede eliminar la empresa" });
                    return res.status(200).send({ deleteCategory });
                })
            })
        } else {
            return res.status(500).send({ mesaje: "No tienes los permisos suficientes" });
        }
    })
}*/

function deleteCategory(req, res) {
    let categoryId = req.params.idCategory

    Category.findOne({ _id: categoryId }, (err, categoryFound) => {
        if (err) {
            return res.status(500).send({ mensaje: 'Error general' })
        } else if (categoryFound) {
            if (categoryFound.name === "default") {
                res.status(500).send({ mensaje: 'No se puede eliminar la categoria "default"' })
            } else {
                let products = categoryFound.product;
                let listProducts = [];

                products.forEach(elemento => {
                    listProducts.push(elemento)
                });
                Category.findOneAndUpdate({ name: "default" }, { $push: { productos: listProducts } }, { new: true }, (err, productPush) => {
                    if (err) {
                        return res.status(500).send({ mensaje: 'Error al registrar el producto en categoria "default"' })
                    } else if (productPush) {
                        Category.findByIdAndDelete(categoryId, (err, categoryRemoved) => {
                            if (err) {
                                return res.status(500).send({ mensaje: 'Error al eliminar la categoria' })
                            } else if (categoryRemoved) {
                                res.send({ mensaje: 'Categoria eliminada', categoryRemoved })
                            } else {
                                res.status(500).send({ mensaje: 'No se elimino la categoria' })
                            }
                        })
                    } else {
                        return res.status(404).send({ mensaje: 'No existe la categoria default' })
                    }
                })
            }
        }else{
        }
    })
}

module.exports = {
    createCategory,
    editCategory,
    deleteCategory
}