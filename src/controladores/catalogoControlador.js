const { db } = require("../config/database");
const { Op } = require('sequelize');


const listarCatalogo = async (req, res) =>{
    try {
        const lista = await db.catalogo.findAll({
            include: [
              {model: db.imagen},
              {model: db.estado},
              {model: db.categoria, as:'categoria'},
              
            ],
            order: [['id_catalogo', 'DESC']]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const FiltroReporteCatalogo = async (req, res) => {
  try {
    const { categoria, nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
    include: [
              {model: db.imagen},
              {model: db.estado},
              {model: db.categoria, as:'categoria'},
              
            ],
            order: [['id_catalogo', 'DESC']]
    };

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { nombre: { [Op.iLike]: `%${nombre}%` } },
      ];
    }

    // Filtro por estado (1 = Activo, 0 = Bloqueado, etc.)
    if (estado) {
      filtros.where.id_estado = estado;
    }

     if (categoria) {
      filtros.where.id_categoria = estado;
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

    const resultado = await db.catalogo.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};
const filtrarPorCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.query;

    const lista = await db.catalogo.findAll({
      where: { id_categoria: id_categoria },
        include: [
              {model: db.imagen},
              {model: db.estado},
              {model: db.categoria, as:'categoria'},
              
            ],
            order: [['id_catalogo', 'DESC']]
    });

    return res.json(lista);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al filtrar por rol' });
  }
};
const buscarcatalogo = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.catalogo.findAll({
             include: [
              {model: db.imagen},
              {model: db.estado},
              {model: db.categoria, as:'categoria'}
              
            ],
            where: {
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${filtro}%` } },  
                 
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};

const cambiarEstadoCatalogo = async (req, res) => {
    try {
        const id_rol = req.params.id;
        
        // Buscar el rol
        const rol = await db.catalogo.findByPk(id_rol, {
            include: { model: db.estado }
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Cambiar el estado (1 = Activo, 2 = Inactivo)
        rol.id_estado = rol.id_estado === 1 ? 2 : 1;

        await rol.save();

        // Traer con la relación de estado actualizada
        const rolActualizado = await db.catalogo.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del rol' });
    }
};


const listarCatalogoID = async (req, res) => {
    try {
        const id_categoria = req.params.id_categoria;
        const lista = await db.catalogo.findAll({
            where: { id_categoria },
             include: [
             { model: db.imagen },
      ] 
        });
        return res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al listar librerías' });
    }
};

const registrarCatalogo = async (req, res) => {
    try {
        req.body.id_categoria = req.body.categoria?.id_categoria;
        req.body.id_imagen = req.body.imagen?.id_imagen;
        req.body.id_estado = req.body.estado?.id_estado;
        const persona = await db.catalogo.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

const modificarCatalogo = async (req, res) => {
    const id = req.params.id;
    console.log('Datos recibidos:', req.body); // Depuración
    try {
        const catalogo = await db.catalogo.findByPk(id);
        if (!catalogo) {
            return res.status(404).json({ mensaje: 'Catálogo no encontrado' });
        }

        // Mapear relaciones con valores por defecto
        req.body.id_categoria = req.body.categoria?.id_categoria || catalogo.id_categoria;
        req.body.id_imagen = req.body.imagen?.id_imagen || catalogo.id_imagen;
        req.body.id_estado = req.body.estado?.id_estado || catalogo.id_estado;

        // Actualizar y devolver los datos modificados
        const [updatedRows] = await db.catalogo.update(req.body, {
            where: { id_catalogo: id },
            returning: true,
        });

        if (updatedRows === 0) {
            console.log('No se realizaron cambios en la base de datos');
            return res.status(400).json({ mensaje: 'No se realizaron cambios' });
        }

        const catalogoActualizado = await db.catalogo.findByPk(id);
        console.log('Catálogo actualizado en BD:', catalogoActualizado);
        res.status(200).json({
            mensaje: 'modificada',
            datos: catalogoActualizado,
        });
    } catch (error) {
        console.error('Error al modificar catálogo:', error);
        res.status(500).json({ mensaje: 'Error al modificar', error: error.message });
    }
};

const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ninguna imagen' });
    }
    res.status(200).json({ nombre: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir imagen' });
  }
};

module.exports = {listarCatalogo, registrarCatalogo, subirImagen, listarCatalogoID, buscarcatalogo, FiltroReporteCatalogo, cambiarEstadoCatalogo,modificarCatalogo,filtrarPorCategoria}