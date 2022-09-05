const mongoose = require('mongoose');

// const dbConecction = async = () => {//Esto no funciona
  async function dbConecction() {

    try {

        await mongoose.connect(process.env.DB_CNN, //Chequear esto del curso hay cosas que ya no funcionan ver doc oficial
        {
            useNewUrlParser: true,
            useUnifiedTopology: true//,
            //useCreateIndex: true // Esto esta deprecado
        }       
    );

    console.log('BD Online');
        
    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de iniciar la BD');
        
    }   

}

module.exports = { 
    dbConecction    
}