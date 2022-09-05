const { response } = require('express');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');
  
const getHospitales = async( req, res) => { 

    const hospitales = await Hospital.find().populate('usuario', 'nombre email');

    res.json({
        ok: true,        
        hospitales
    });

}

const crearHospital = async( req, res = response) => { 

    const uid = req.uid; // porque ya pase por la validacion del token y aho extraje el uid
    const hospital = new Hospital({ //Aqui desestructuro para pasarle a la propiedad usuario del modelo el uid
        usuario: uid,
        ...req.body });
    

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }

}

const actualizarHospital = async( req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById( id );
        
        if (!hospital) {

            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
            
        } 

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, {new: true}); // El new regresa los ultimos valores actualizados del registro
        

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            ok: false,
            msg: 'Hable con el administardor'

        });
        
    }

}

const borrarHospital = async( req, res = response) => {

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById( id );
        
        if (!hospital) {

            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
            
        } 

        await Hospital.findByIdAndDelete( id);         

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            ok: false,
            msg: 'Hable con el administardor'

        });
        
    }

}


module.exports = { 
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital 
}