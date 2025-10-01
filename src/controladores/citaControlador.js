const { db } = require("../config/database");
const { Op } = require('sequelize');
const vehiculo = require("../modelos/vehiculo");

const listarCita = async (req, res) =>{
    try {
        const lista = await db.cita.findAll({
            include: [
              {model: db.estado},
              {model: db.vehiculo,
                include:[{model: db.cliente,
                    include: [{model: db.persona}]
                }, {model: db.modelo}, {model: db.tipo_vehiculo} ],
                
              }
            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 


const cambiarEstadoCita = async (req, res) => {
    try {
        const id_rol = req.params.id;
        
        // Buscar el rol
        const rol = await db.cita.findByPk(id_rol, {
            include: { model: db.estado }
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Cambiar el estado (1 = Activo, 2 = Inactivo)
        rol.id_estado = rol.id_estado === 1 ? 2 : 1;

        await rol.save();

        // Traer con la relación de estado actualizada
        const rolActualizado = await db.cita.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del rol' });
    }
};


const registrarCita = async (req, res) => {
    try {
        req.body.placa = req.body.vehiculo?.placa;
        req.body.id_estado = req.body.estado?.id_estado;
        const persona = await db.cita.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

const modificarCita = async (req, res) => {
  try {
    const { id_cita, fecha_c, hora_c, obs, placa, id_estado } = req.body;
    const cita = await db.cita.findByPk(id_cita);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    cita.fecha_c = fecha_c;
    cita.hora_c = hora_c;
    cita.obs = obs;
    cita.placa = placa;
    cita.id_estado = id_estado;
    await cita.save();
    res.status(200).json(cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al modificar cita' });
  }
};

const FiltroReporteCita = async (req, res) => {
  try {
    const { nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
      include: [
              {model: db.estado},
              {model: db.vehiculo,
                include:[{model: db.cliente,
                    include: [{model: db.persona}]
                }, {model: db.modelo}, {model: db.tipo_vehiculo} ],
                
              }
            ]
    };

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { '$vehiculo.cliente.persona.nombre$': { [Op.iLike]: `%${nombre}%` } },
        { '$vehiculo.cliente.persona.ap_paterno$': { [Op.iLike]: `%${nombre}%` } },
        { '$vehiculo.cliente.persona.ap_materno$': { [Op.iLike]: `%${nombre}%` } }
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

    const resultado = await db.cita.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};

const actualizarCitasVencidas = async () => {
  try {
    const ahora = new Date(); // fecha y hora actual

    // Traer todas las citas activas (estado 1)
    const citasActivas = await db.cita.findAll({
      where: { id_estado: 1 }
    });

    for (const cita of citasActivas) {
      // Construir fecha y hora completa de la cita
      const fechaHoraCita = new Date(`${cita.fecha_c}T${cita.hora_c}`);

      // Sumar 1 hora de tolerancia
      const fechaHoraLimite = new Date(fechaHoraCita.getTime() + 60 * 60 * 1000);

      // Si ya pasó la hora límite, cambiar estado a 4 (Incumplido)
      if (ahora > fechaHoraLimite) {
        await cita.update({ id_estado: 4 });
      }
    }
  } catch (error) {
  }
};
module.exports = {listarCita, registrarCita, cambiarEstadoCita, modificarCita, FiltroReporteCita, actualizarCitasVencidas}