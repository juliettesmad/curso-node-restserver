const { response, json } = require("express");
const bcryptjs = require('bcryptjs'); 
const Usuario = require('../models/usuario');

const usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



const login  = async (req, res= response) =>{

    const {correo, password } =req.body;

    try{

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        //verificar Contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }


        // generar JWT

        const token = await generarJWT (usuario.id);

        
        res.json({
             usuario,
             token
        })
        

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}


const googleSingIn = async ( req, res= response) =>{

    const {id_token } = req.body;
    try{
        const { correo, nombre, img} = await googleVerify(id_token);
         
        let usuario = await Usuario.findOne({ correo });

        if(!usuario){
            const data ={ 
                nombre,
                correo,
                password: ':)',
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }

        // SI EL USUARIO TIENE EL ESTADO NEGADO
        if (!usuario.estado){
            return res.status(401).json({
                msg: ' Hable con el administrador, usuario bloqueado'
            })
        }
       // generar JWT
         const token = await generarJWT (usuario.id); 


        res.json({
            usuario,
            token
        });
    }catch( error) {
        res.status(400).json({
            
            msg: 'El token no se pudo verificar'
        })

    }

    
}

module.exports = {
    login,
    googleSingIn
}
