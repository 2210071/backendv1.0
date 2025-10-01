const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarCiudad = async (req, res) =>{
    try {
        const lista = await db.ciudad.findAll({
            include: [
              {model: db.dep},
              

            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 



module.exports = {listarCiudad}