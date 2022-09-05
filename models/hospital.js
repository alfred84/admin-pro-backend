const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'hospitales' });

//Aqui se eliminan o modifican los elementos del objeto del modelo que se muestran de respuesta
HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();    
    return object;
});

module.exports = model( 'Hospital', HospitalSchema );
