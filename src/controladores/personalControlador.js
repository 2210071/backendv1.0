const { db,sequelize  } = require("../config/database");
const { Op } = require('sequelize');

const listarPersonal = async (req, res) =>{
    try {
        const lista = await db.personal.findAll({
            include:[{model: db.persona, 
                include: [
                    {model: db.roles, as:"roles"},
                    {model: db.estado}     
                ]
               }] ,

            order: [['id_persona', 'DESC']]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 
const filtrarPorRol = async (req, res) => {
  try {
    const { id_rol } = req.query;

    const lista = await db.personal.findAll({
      where: { '$persona.id_rol$': id_rol }, // 👈 aquí el cambio
      include: [
        {
          model: db.persona,
          include: [
            { model: db.roles, as: "roles" },
            { model: db.estado }
          ]
        }
      ]
    });

    return res.json(lista);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al filtrar por rol' });
  }
};

const buscarPersonal = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.personal.findAll({
             include:[{model: db.persona, 
                include: [
                    {model: db.roles, as:"roles"},
                    {model: db.estado}     
                ]
               }] ,
            where: {
                [Op.or]: [
                    { '$persona.nombre$': { [Op.iLike]: `%${filtro}%` } },  
                     { '$persona.ap_paterno$': { [Op.iLike]: `%${filtro}%` } },  
                      { '$persona.ap_materno$': { [Op.iLike]: `%${filtro}%` } }, 
                 
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};


// registrar persona + personal en un solo método
const registrarPersonal = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const idRol = req.body.roles?.id_rol;
    const idEstado = req.body.estado?.id_estado;

    // Crear persona
    const nuevaPersona = await db.persona.create(
      { ...req.body, id_rol: idRol, id_estado: idEstado },
      { transaction: t }
    );

    // Crear personal asociado
    const nuevoPersonal = await db.personal.create(
      { ...req.body, id_persona: nuevaPersona.id_persona },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      mensaje: "Persona y personal registrados correctamente",
      persona: nuevaPersona,
      personal: nuevoPersonal
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar persona/personal" });
  }
};


// modificar persona/personal
const modificarPersonal = async (req, res) => {
  const id = req.params.id; // id_persona
  const t = await sequelize.transaction();  // 🔹 corregido
  try {
    // Actualizar persona
    await db.persona.update(req.body, {
      where: { id_persona: id },
      transaction: t
    });

    // Actualizar personal (si existe para esa persona)
    await db.personal.update(req.body, {
      where: { id_persona: id },
      transaction: t
    });

    await t.commit();
    res.status(200).json({ mensaje: "Persona y personal modificados correctamente" });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al modificar persona/personal" });
  }
};





module.exports = {listarPersonal, registrarPersonal,  buscarPersonal, filtrarPorRol, modificarPersonal}