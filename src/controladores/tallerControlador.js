const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarTaller = async (req, res) =>{
    try {
        const lista = await db.taller.findAll({
            include: [
              {model: db.ciudad,
                include: [{
                    model: db.dep
                }]
              },
              
            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

//modifcar sub caegoria
const modificarTaller = async (req, res) => {
    const id = req.params.id;
    try {
         req.body.id_ciudad = req.body.ciudad?.id_ciudad;
        await db.taller.update(req.body, { where: { id_taller: id } });
        res.status(200).json({ mensaje: 'modificada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar' });
    }
};


module.exports = {listarTaller, modificarTaller}