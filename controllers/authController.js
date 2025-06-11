const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registrarUsuario = async (req, res) => {
    const {nombre, correo, contrasena} = req.body
    try {
        let usuario = await Usuario.findOne({correo});
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'})
        }

        usuario = new Usuario({nombre, correo, contrasena})
        const salt = await bcrypt.genSalt(10)
        usuario.contrasena = await bcrypt.hash(contrasena, salt)

        await usuario.save();

        const payload = { usuario: { id: usuario.id}}
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}

exports.autenticarUsuario =  async (req, res) => {
    const { correo, contrasena} = req.body;

    try {
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        const esMatch = await bcrypt.compare(contrasena, usuario.contrasena)
        if(!esMatch){
            return res.status(400).json({msg: 'Contraseña incorrecta'})
        }

        const payload = {usuario: {id:usuario.id}}
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.json({token})
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}