'use strict'

const Product = require("../models/product.model");
const User = require("../models/user.model");

function createProduct(req, res) {
    var productModel = new Product();
    var params = req.body;

    if (params.name && params.stock && params.price && params.sold) {
        productModel.name = params.name;
        productModel.category = params.category;
        productModel.stock = params.stock;
        productModel.price = params.price;
        productModel.sold = params.sold;
        Product.find({
            $or: [
                { name: productModel.name }
            ]
        }).exec((err, productFound) => {
            if (err) return res.status(500).send({ mesaje: "Error en la petición" });
            if (productFound && productFound.length >= 1) {
                return res.status(500).send({ mesaje: "El producto ya existe" });
            } else {
                productModel.save((err, saveProduct) => {
                    if (saveProduct) {
                        res.status(200).send(saveProduct);
                    }
                })
            }
        })
    } else {
        return res.status(200).send({ mensaje: 'faltan datos' })
    }
}

function editProduct(req, res) {
    var IdProduct = req.params.idProduct;
    var params = req.body;

    Product.findOne({ name: params.name }, (err, productFound) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor, intentelo más tarde" });
        } else if (productFound) {
            res.status(200).send({ message: "El producto ya existe" });
        } else {
            Product.findByIdAndUpdate(IdProduct, params, { new: true }, (err, productUpdate) => {
                if (err) {
                    res.status(500).send({ message: "Error en el servidor al intentar actualizar, intentelo más tarde" });
                } else if (productUpdate) {
                    res.status(200).send({ message: "Producto actualizado exitosamente", productUpdate });
                } else {
                    res.status(200).send({ message: "No existe el producto" });
                }
            })
        }
    })
}

function deleteProduct(req, res) {
    var params = req.params;
    Product.findByIdAndRemove(params.idProduct, (err, deleteProduct) => {
        if (err) return res.status(500).send({ mesaje: "Error en la petición" });
        if (!deleteProduct) return res.status(500).send({ mesaje: "No se puede eliminar el producto" });
        return res.status(200).send({ deleteProduct });
    })
}


function searchProductByName(req, res) {
    var params = req.body;

    Product.find({
        $or: [
            { name: params.name }
        ]
    }).exec((err, productFound) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (productFound && productFound.length >= 1) {
            return res.status(200).send(productFound)
        } else {
            return res.status(500).send({ mensaje: "no existe el producto" })
        }
    })
}
module.exports = {
    createProduct,
    editProduct,
    deleteProduct,
    searchProductByName
}