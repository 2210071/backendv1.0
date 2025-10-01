const { db,sequelize  } = require("../config/database");
const { Op } = require('sequelize');

const listarCliente = async (req, res) =>{
    try {
        const lista = await db.cliente.findAll({
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


const buscarCliente = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.cliente.findAll({
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



const registrarCliente = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { persona } = req.body; // 👈 extraemos persona

    // 1️⃣ Crear persona
    const nuevaPersona = await db.persona.create(
      {
        ...persona,                     // todos los campos de la persona
        id_rol: persona.roles?.id_rol,  // obligatorio
        id_estado: persona.estado?.id_estado // obligatorio
      },
      { transaction: t }
    );

    // 2️⃣ Crear cliente asociado (solo id_persona)
    const nuevoCliente = await db.cliente.create(
      { id_persona: nuevaPersona.id_persona },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      persona: nuevaPersona,
      cliente: nuevoCliente
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar cliente" });
  }
};


// modificar persona/personal
const modificarCliente = async (req, res) => {
  const id = req.params.id; // id_persona
  const t = await sequelize.transaction();  // 🔹 corregido
  try {
    // Actualizar persona
    await db.persona.update(req.body, {
      where: { id_persona: id },
      transaction: t
    });

    // Actualizar personal (si existe para esa persona)
    await db.cliente.update(req.body, {
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





module.exports = {listarCliente, registrarCliente, buscarCliente, modificarCliente}