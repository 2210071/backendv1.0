const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarImagen = async (req, res) =>{
    try {
        const lista = await db.imagen.findAll({
           
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const registrarImagen = async (req, res) => {
    try {
    
        const persona = await db.imagen.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

module.exports = {listarImagen, registrarImagen}