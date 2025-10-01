const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarMetodo_pago = async (req, res) =>{
    try {
        const lista = await db.mpago.findAll({
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 


module.exports = {listarMetodo_pago}