const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');

const login = async( req, res = response) => {

    const { email, password} = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({email} );

        if (!usuarioDB) {

            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });  
            
        }
        
        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            }); 
        }

        //Generar el TOKEN (JWT)
        const token = await generarJWT( usuarioDB.id);  
        
        // let usuario = usuarioDB;

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuarioDB.role )
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
        
    }


}


const googleSignIn = async ( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });            
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        //Generar el TOKEN (JWT)
        const token = await generarJWT( usuario.id);        

        res.json({
            ok: true,
            msg: 'Google Signin',
            token,
            menu: getMenuFrontend( usuario.role )
        });
        
    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'            
        });
        
    }    

}


const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //Generar el TOKEN (JWT)
    const token = await generarJWT( uid);

    //Obtener usuario por UID
    const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontend( usuario.role )        
    });

}


module.exports = { 
    login,
    googleSignIn,
    renewToken    
}