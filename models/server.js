const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const {Router} = require('express'); 

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //conecion a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();
        
        //Rutas de mi aplicacion 
        this.routes();
    }
    
    async conectarDB( ) {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(  cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );


        //Directorio publico
         this.app.use( '/error',express.static('public') );
    }

    routes(){
       
     
        this.app.use('/', require('../routes/principal'));



        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port,  ( )=>{
            console.log('servidor corriendo en puerto', this.port);
        });
        
    }


}

module.exports = Server;