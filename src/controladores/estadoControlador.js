const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarEstado = async (req, res) =>{
    try {
        const lista = await db.estado.findAll({
            
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 



module.exports = {listarEstado}