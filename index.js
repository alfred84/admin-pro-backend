// console.log('hola mundo');
const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const { dbConecction } = require('./database/config');

// console.log(process.env); //probando que funciona dotenv

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConecction();

// Directorio publico
app.use(express.static('public'));

//Rutas
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/upload', require('./routes/uploads') );

// Lo último
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});