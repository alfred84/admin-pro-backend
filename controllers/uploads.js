const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async( req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
        
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        }); //.send('No files were uploaded.');
    }

    // Procesar la imagen
    const file = req.files.imagen;

    // Extraer extension
    const nombreCortado = file.name.split('.'); // Para dividir el nombre de la imagen en una arreglo de strings entre los puntos Wolverine.1.2.jpg  ['Wolverine', '1', '2', 'jpg']
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1]; //para obtener el ultimo elemento del arreglo de caracteres ['jpg']

    // Validar la extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {

        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
        
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen hacia el path
    file.mv( path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar BD
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,            
            msg: 'Archivo subido',
            nombreArchivo
        });

    });    

}

const retornaImagen = async( req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);    

    // Imagen por defecto
    if( fs.existsSync( pathImg ) ) {

        res.sendFile( pathImg );

    } else {

        const pathImg = path.join( __dirname, `../uploads/no-img.png`); 

        res.sendFile( pathImg );

    }


}


module.exports = { 
    fileUpload,
    retornaImagen
}