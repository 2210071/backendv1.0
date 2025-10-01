const { db } = require("../config/database");
const { Op } = require("sequelize");

const filtrarPorRol = async (req, res) => {
  try {
    const { id_rol } = req.query;

    const lista = await db.persona.findAll({
      where: { id_rol: id_rol },
      include: {
        model: db.roles,
        as: 'roles',
        where: { } 
      }
    });

    return res.json(lista);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al filtrar por rol' });
  }
};
const buscarServicio = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.servicio.findAll({
             include: [
              {model: db.estado},
              {model: db.vehiculo,
                include: [{model: db.persona}, {model: db.tipo_vehiculo}]
              },
              {model: db.persona}
            ],
              where: {
                [Op.or]: [
                    { '$vehiculo.placa$': { [Op.iLike]: `%${filtro}%` } },
                    { '$vehiculo.persona.nombre$': { [Op.iLike]: `%${filtro}%` } },
                     { '$vehiculo.persona.ap_paterno$': { [Op.iLike]: `%${filtro}%` } },
                      { '$vehiculo.persona.ap_materno$': { [Op.iLike]: `%${filtro}%` } },
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};
module.exports = { filtrarPorRol, buscarServicio };
