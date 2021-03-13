'use strict'

const User = require("../models/user.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function login(req, res) {
    var params = req.body;

    User.findOne({ user: params.user }, (err, userFound) => {
        if (err) return res.status(500).send({ mesaje: "Error en la petición" });
        if (userFound) {
            bcrypt.compare(params.pass, userFound.pass, (err, correctPass) => {
                if (correctPass) {
                    if (params.getToken === "true") {
                        return res.status(200).send({
                            userFound, token: jwt.createToken(userFound)
                        });
                    } else {
                        userFound.pass = undefined;
                        return res.status(200).send({ mesaje: "Token no valido" });
                    }
                } else {
                    return res.status(404).send({ mesaje: "El usuario no se ha podido identificar" })
                }
            })
        } else {
            return res.status(404).send({ mesaje: "El usuario no ha podido ingresar" })
        }
    })
}

function register(req, res) {
    var userModel = new User();
    var params = req.body;
    if (params.user && params.pass) {
        userModel.user = params.user;
        userModel.pass = params.pass;
        userModel.rol = "CLIENTE";
        User.find({
            $or: [
                { user: userModel.user },
            ]
        }).exec((err, userFound) => {
            if (err) return res.status(500).send({ mesaje: "Error en la petición" });

            if (userFound && userFound.length >= 1) {
                return res.status(500).send({ mesaje: "El usuario ya existe" });
            } else {
                bcrypt.hash(params.pass, null, null, (err, encryptpass) => {
                    userModel.pass = encryptpass;
                    userModel.save((err, saveUser) => {
                        if (saveUser) {
                            res.status(200).send(saveUser);
                        }
                    })
                })
            }
        })
    }
}

/*function editClient(req, res) {
    var idUser = req.params.idUser;
    var params = req.body;

    User.findById(req.user.sub, (err, userFound) => {
        if (err) return res.status(500).send({ mesaje: "Error al hacer la petición" });
        if (!userFound) { return res.status(500).send({ mesaje: "No posees los permisos necesarios de administracion" }) }
        if (userFound.rol === "ADMIN") {
            User.findByIdAndUpdate(params.idUser, params, { new: true }, (err, updateUser) => {
                if (err) return res.status(500).send({ mesaje: "Error en la petición" });
                if (!updateUser) return res.status(500).send({ mesaje: "No se pudo actualizar el cliente" });
                return res.status(200).send({ updateUser });
            })
        } else {
            delete params.rol;
            if (idUser != idUser) {
                return res.status(500).send({ mesaje: "No posees los permisos necesarios" })
            }
            User.findByIdAndUpdate(req.user.sub, params, { new: true }, (err, updateUser) => {
                if (err) return res.status(500).send({ mesaje: "Error en la petición" });
                if (!updateUser) return res.status(500).send({ mesaje: "No se pudo actualizar el cliente" });
                return res.status(200).send({ updateUser });
            })
        }
    })
}*/

function editClient(req, res) {
    let userId = req.params.idUser;
    let update = req.body;

    User.findOne({ user: update.user }, (err, userFound) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor, intentelo más tarde" });
        } else if (userFound) {
            res.status(200).send({ message: "El nombre de usuario ya existente" });
        } else {
            User.findByIdAndUpdate(userId, update, { new: true }, (err, updateUser) => {
                if (err) {
                    res.status(500).send({ message: "Error en el servidor al intentar actualizar, intentelo más tarde" });
                } else if (updateUser) {
                    res.status(200).send({ message: "Usuario actualizado exitosamente", updateUser });
                } else {
                    res.status(200).send({ message: "No existe el usuario" });
                }
            })
        }
    })
}

function deleteClient(req,res){
    let userId = req.params.idUser;

    User.findByIdAndRemove(userId,(err,userRemoved)=>{
        if(err){
            res.status(500).send({message: "Error en el servidor al eliminar, intentelo más tarde"});
        }else if(userRemoved){
            res.status(200).send({message: "Usuario eliminado exitosamente", userRemoved});
        }else{
            res.status(200).send({message: "El usuario no existe o ya fue eliminado"});
        }
    })
}

module.exports = {
    register,
    login,
    editClient,
    deleteClient
}