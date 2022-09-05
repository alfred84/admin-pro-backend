// Dos formas de importar paquetes de mongoose (Una usando la forma tradicional y otra usando destructuracion)

// const mongoose = require('mongoose');
// mongoose.Schema
// mongoose.model

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Aqui se eliminan o modifican los elementos del objeto del modelo que se muestran de respuesta
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model( 'Usuario', UsuarioSchema );
