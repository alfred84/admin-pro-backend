const { response } = require('express');
const bcrypt = require('bcryptjs');

const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');
  
const getMedicos = async( req, res) => { 

    const medicos = await Medico.find().populate('usuario','nombre img').populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });

}

const getMedicoById = async( req, res) => { 

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id )
                               .populate('usuario','nombre img')
                               .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }    

}

const crearMedico = async( req, res = response) => { 

    const uid = req.uid; // porque ya pase por la validacion del token y aho extraje el uid
    const medico = new Medico({ //Aqui desestructuro para pasarle a la propiedad usuario del modelo el uid
        usuario: uid,
        ...req.body });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }
}

const actualizarMedico = async( req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById( id );
        
        if (!medico) {

            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
            
        } 

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, {new: true}); // El new regresa los ultimos valores actualizados del registro
        

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            ok: false,
            msg: 'Hable con el administardor'

        });
        
    }

}

const borrarMedico = async( req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id );
        
        if (!medico) {

            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
            
        } 

        await Medico.findByIdAndDelete( id);         

        res.json({
            ok: true,
            msg: 'Medico eliminado'
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
    getMedicos,
    getMedicoById,
    crearMedico,
    actualizarMedico,
    borrarMedico 
}