const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarServicio= async (req, res) =>{
    try {
        const lista = await db.servicio.findAll({
            include: [
                {model: db.detalle_servicio,
                    include:[
                        {model: db.catalogo}
                    ]
                },
                {model: db.personal,
                    include: [{
                        model: db.persona
                    }]
                },
              {model: db.estado},
              
              {model: db.vehiculo,
                include: [{model: db.cliente,
                    include:[{
                        model: db.persona
                    }]
                }, {model: db.tipo_vehiculo}]
              },
              {model: db.factura, as: "factura",
                include:[
                    {model: db.mpago}
                ]
              },
            ],
            order: [['id_servicio', 'DESC']]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const filtrarPorEstado = async (req, res) => {
  try {
    const { id_estado } = req.query;

    const lista = await db.servicio.findAll({
      where: { id_estado: id_estado },
      include: [
                {model: db.personal,
                    include: [{
                        model: db.persona
                    }]
                },
              {model: db.estado},
              {model: db.vehiculo,
                include: [{model: db.cliente,
                    include:[{
                        model: db.persona
                    }]
                }, {model: db.tipo_vehiculo}]
              },
            ],
    });

    return res.json(lista);
  } catch (error) {
    console.error("Error en filtrarPorEstado:", error);
    res.status(500).json({ mensaje: "Error al filtrar modelos", detalle: error.message });
  }
};

const buscarServicio = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.servicio.findAll({
             include: [
                {model: db.personal,
                    include: [{
                        model: db.persona
                    }]
                },
              {model: db.estado},
              {model: db.vehiculo,
                include: [{model: db.cliente,
                    include:[{
                        model: db.persona
                    }]
                }, {model: db.tipo_vehiculo}]
              },
            ],
              where: {
                [Op.or]: [
                    { '$vehiculo.placa$': { [Op.iLike]: `%${filtro}%` } },
                    { '$vehiculo.cliente.persona.nombre$': { [Op.iLike]: `%${filtro}%` } },
                     { '$vehiculo.cliente.persona.ap_paterno$': { [Op.iLike]: `%${filtro}%` } },
                      { '$vehiculo.cliente.persona.ap_materno$': { [Op.iLike]: `%${filtro}%` } },
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};

const FiltroReporteServicio = async (req, res) => {
  try {
    const { metodo, nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
     include: [
                {model: db.detalle_servicio,
                    include:[
                        {model: db.catalogo}
                    ]
                },
                {model: db.personal,
                    include: [{
                        model: db.persona
                    }]
                },
              {model: db.estado},
              
              {model: db.vehiculo,
                include: [{model: db.cliente,
                    include:[{
                        model: db.persona
                    }]
                }, {model: db.tipo_vehiculo}]
              },
              {model: db.factura, as: "factura",
                include:[
                    {model: db.mpago}
                ]
              },
            ],
            order: [['id_servicio', 'DESC']]
    };

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { '$vehiculo.cliente.persona.nombre$': { [Op.iLike]: `%${nombre}%` } },
        { '$vehiculo.cliente.persona.ap_paterno$': { [Op.iLike]: `%${nombre}%` } },
        {'$vehiculo.cliente.persona.ap_materno$': { [Op.iLike]: `%${nombre}%` } }
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

    const resultado = await db.servicio.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};

const cambiarEstadoServicio = async (req, res) => {
    try {
        const id_rol = req.params.id;
        
        // Buscar el rol
        const rol = await db.servicio.findByPk(id_rol, {
            include: { model: db.estado }
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Cambiar el estado (1 = Activo, 2 = Inactivo)
        rol.id_estado = rol.id_estado === 1 ? 2 : 1;

        await rol.save();

        // Traer con la relación de estado actualizada
        const rolActualizado = await db.servicio.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del rol' });
    }
};


const listardetServicio= async (req, res) =>{
    try {
        const lista = await db.detalle_servicio.findAll({
            include: [ 
              {model: db.catalogo},
              {model: db.servicio}
            ],
            order: [['id_detser', 'DESC']]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 
const listardetServicioID = async (req, res) => {
    try {
        const id_servicio = req.params.id_servicio;
        const lista = await db.detalle_servicio.findAll({
            where: { id_servicio },
             include: [
             { model: db.catalogo },
      ] 
        });
        return res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al listar librerías' });
    }
};
const registrarServicio = async (req, res) => {
    try {
        req.body.placa = req.body.vehiculo?.placa;
        req.body.id_estado = req.body.estado?.id_estado;
        req.body.id_persona = req.body.personal?.id_persona;
        const persona = await db.servicio.create(req.body);
          // Buscar la última cita activa del vehículo
    const ultimaCita = await db.cita.findOne({
      where: { placa: req.body.placa, id_estado: 1 }, // solo si está Activo
      order: [['id_cita', 'DESC']] // la más reciente
    });

    // Si existe una cita activa, cambiar a Completado (id_estado = 3)
    if (ultimaCita) {
      await ultimaCita.update({ id_estado: 3 });
    }

        res.status(201).json(persona);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

const registrardetServicio = async (req, res) => {
    try {
        
        req.body.id_catalogo = req.body.catalogo?.id_catalogo;
        req.body.id_servicio = req.body.servicio?.id_servicio;
        const persona = await db.detalle_servicio.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

// Método unificado para modificar servicio y sus detalles
const modificarServicio = async (req, res) => {
  try {
    const { id_servicio, detalles, ...servicioData } = req.body;

    // Modificar el servicio directamente con los datos enviados
    await db.servicio.update(servicioData, { where: { id_servicio } });

    // Modificar o crear detalles
    for (const det of detalles || []) {
      if (det.id_detser) {
    
        await db.detalle_servicio.update(
          { precio: det.precio || 0, obs: det.obs || '' },
          { where: { id_detser: det.id_detser } }
        );
      } else {
       
        await db.detalle_servicio.create({
          id_servicio,
          id_catalogo: det.catalogo.id_catalogo,
          precio: det.precio || 0,
          obs: det.obs || ''
        });
      }
    }

    // Retornar servicio actualizado con detalles
    const servicioActualizado = await db.servicio.findByPk(id_servicio, {
      include: [{ model: db.detalle_servicio, include: [db.catalogo] }]
    });

    res.status(200).json(servicioActualizado);

  } catch (error) {
    console.error('❌ Error en modificarServicioCompleto:', error);
    res.status(500).json({ mensaje: 'Error al modificar servicio completo' });
  }
};

const eliminarDetalleServcio = async (req, res) => {
    try {
        const id = req.params.xcod;
        await db.detalle_servicio.destroy({ where: { id_detser: id } });
        res.status(200).json({ mensaje: 'cate eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
}

module.exports = {listarServicio, listardetServicio, registrarServicio, 
    registrardetServicio, listardetServicioID, buscarServicio, FiltroReporteServicio,
    cambiarEstadoServicio, modificarServicio, filtrarPorEstado,eliminarDetalleServcio}