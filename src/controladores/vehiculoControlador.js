const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarModelo = async (req, res) =>{
    try {
        const lista = await db.z.findAll({
            include: [
              {model: db.marca},
              

            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 


const listarColor = async (req, res) =>{
    try {
        const lista = await db.color.findAll({
           
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const listarTipo = async (req, res) =>{
    try {
        const lista = await db.tipo_vehiculo.findAll({
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const listarVehiculo = async (req, res) =>{
    try {
        const lista = await db.vehiculo.findAll({
            include: [
              {model: db.cliente,
                include:[{model: db.persona,
                    include: [{
                        model: db.estado
                    }]
                }]
              },
              {model: db.color},
               {model: db.modelo,
                include: [{ model: db.marca  },]
               },
              {model: db.tipo_vehiculo}

            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const filtrarModeloPorMarca = async (req, res) => {
  try {
    const { id_marca } = req.query;

    const lista = await db.modelo.findAll({
      where: { id_marca: id_marca },
      include: [
        { model: db.marca } 
      ]
    });

    return res.json(lista);
  } catch (error) {
    console.error("Error en filtrarModeloPorMarca:", error);
    res.status(500).json({ mensaje: "Error al filtrar modelos", detalle: error.message });
  }
};

const FiltroReporteVehiculo = async (req, res) => {
  try {
    const { modelo, nombre, tipo } = req.query;

    const filtros = {
      where: {},
   include: [
              {model: db.cliente,
                include:[{model: db.persona,
                    include: [{
                        model: db.estado
                    }]
                }]
              },
              {model: db.color},
               {model: db.modelo,
                include: [{ model: db.marca  },]
               },
              {model: db.tipo_vehiculo}

            ],
          
    };

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { placa: { [Op.iLike]: `%${nombre}%` } },
      ];
    }

    // Filtro por estado (1 = Activo, 0 = Bloqueado, etc.)
    if (tipo) {
      filtros.where.id_tipo_vehiculo = tipo;
    }

     if (modelo) {
      filtros.where.id_modelo= modelo;
    }

   

    const resultado = await db.vehiculo.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};

const buscarVehiculo = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.vehiculo.findAll({
            include: [
              {model: db.cliente,
                include:[{model: db.persona,
                      include: [{
                        model: db.estado
                      }]
                }]
              },
              {model: db.color},
               {model: db.modelo,
                include: [{ model: db.marca  },]
               },
              {model: db.tipo_vehiculo}

            ],
            where: {
                [Op.or]: [
                    { placa: { [Op.iLike]: `%${filtro}%` } },  
                 
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};

const registrarVehiculo = async (req, res) => {
    try {
       req.body.id_modelo = req.body.modelo?.id_modelo;
       req.body.id_color = req.body.color?.id_color;
       req.body.id_persona = req.body.cliente?.id_persona;
        req.body.id_tipo_vehiculo = req.body.tipo_vehiculo?.id_tipo_vehiculo;
        const persona = await db.vehiculo.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};
const modificarVehiculo = async (req, res) => {
    const id = req.params.id;
    try {
         req.body.id_modelo = req.body.modelo?.id_modelo;
       req.body.id_color = req.body.color?.id_color;
       req.body.id_persona = req.body.cliente?.id_persona;
        req.body.id_tipo_vehiculo = req.body.tipo_vehiculo?.id_tipo_vehiculo;
        await db.vehiculo.update(req.body, { where: { placa: id } });
        res.status(200).json({ mensaje: 'modificada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar' });
    }
};
const eliminarVehiculo = async (req, res) => {
    try {
        const id = req.params.xcod;
        await db.vehiculo.destroy({ where: { anio: id } });
        res.status(200).json({ mensaje: 'vehiculo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
}

module.exports = {listarVehiculo, registrarVehiculo, listarColor, FiltroReporteVehiculo,
    listarModelo, listarTipo, buscarVehiculo,modificarVehiculo, filtrarModeloPorMarca, eliminarVehiculo}