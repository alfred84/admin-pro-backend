const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {

    // Para borrar la imagen vieja    
    if ( fs.existsSync( path )) {  
        fs.unlinkSync( path );                
    }

}

const actualizarImagen = async ( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch (tipo) {
        case 'medicos':

            // Para comprobar que el id del medico esta en la BD
            const medico = await Medico.findById(id);
            if( !medico ) {
                console.log('No es un medico por id');
                return false;
            }

            // Para borrar la imagen vieja
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            // Guardamos la imagen
            medico.img = nombreArchivo;
            await medico.save();

            return true;
            
            break;
        case 'hospitales':

            // Para comprobar que el id del hospital esta en la BD
            const hospital = await Hospital.findById(id);
            if( !hospital ) {
                console.log('No es un hospital por id');
                return false;
            }

            // Para borrar la imagen vieja
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            // Guardamos la imagen
            hospital.img = nombreArchivo;
            await hospital.save();

            return true;
            
            break;
        case 'usuarios':

            // Para comprobar que el id del usuario esta en la BD
            const usuario = await Usuario.findById(id);
            if( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            // Para borrar la imagen vieja
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            // Guardamos la imagen
            usuario.img = nombreArchivo;
            await usuario.save();

            return true;
            
            break;
    
        default:
            break;
    }

}


module.exports = {
    actualizarImagen
}