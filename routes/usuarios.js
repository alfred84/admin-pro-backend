/*
   Ruta: '/api/usuarios' 
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE, varlidarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y unico').isEmail(),
        validarCampos
    ], 
    crearUsuario    
);

router.put('/:id', 
    [
        validarJWT,
        varlidarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y unico').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizarUsuario    
);

router.delete('/:id', 
    [validarJWT, validarADMIN_ROLE],
    borrarUsuario    
);



// router.get('/', //Ruta

// //Controlador
//    ( req, res) => { 
//     res.json({
//         ok: true,
//         usuarios: [{
//             id: 123,
//             nombre: 'Alfredo Saltaren'
//         }]
//     });

// });

module.exports = router;