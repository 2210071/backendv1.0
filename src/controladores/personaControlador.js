const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarPersona = async (req, res) =>{
    try {
        const lista = await db.persona.findAll({
            include:[{model: db.roles, as:"roles"},
                {model: db.estado},
                { model: db.personal,
                    include: [{
                        model: db.usuario
                    }]
                 }
            ] ,

            order: [['id_persona', 'DESC']]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const cambiarEstadoPersona = async (req, res) => {
    try {
        const id_rol = req.params.id;
        
        // Buscar el rol
        const rol = await db.persona.findByPk(id_rol, {
            include:[{model: db.roles, as:"roles"},
                {model: db.estado}
            ] ,
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Cambiar el estado (1 = Activo, 2 = Inactivo)
        rol.id_estado = rol.id_estado === 1 ? 2 : 1;

        await rol.save();

        // Traer con la relación de estado actualizada
        const rolActualizado = await db.persona.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del rol' });
    }
};
const FiltroReportePersona = async (req, res) => {
  try {
    const { rol, nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
      include:[{model: db.roles, as:"roles"},
                {model: db.estado},
                { model: db.personal,
                    include: [{
                        model: db.usuario
                    }]
                 }
            ] ,
    };

    // Filtro por rol (idrol)
    if (rol) {
      filtros.where.id_rol = rol;
    }

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { nombre: { [Op.iLike]: `%${nombre}%` } },
        { ap_paterno: { [Op.iLike]: `%${nombre}%` } },
        { ap_materno: { [Op.iLike]: `%${nombre}%` } }
      ];
    }

    // Filtro por estado (1 = Activo, 0 = Bloqueado, etc.)
    if (estado) {
      filtros.where.id_estado = estado;
    }

    // Filtro por fecha
    if (fechaDesde && fechaHasta) {
      filtros.where.fecha = {
        [Op.between]: [fechaDesde, fechaHasta]
      };
    } else if (fechaDesde) {
      filtros.where.fecha = {
        [Op.gte]: fechaDesde
      };
    } else if (fechaHasta) {
      filtros.where.fecha = {
        [Op.lte]: fechaHasta
      };
    }

    const resultado = await db.persona.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};
module.exports = {listarPersona, cambiarEstadoPersona, FiltroReportePersona }