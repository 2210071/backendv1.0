const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarRol = async (req, res) =>{
    try {
        const lista = await db.roles.findAll({
            include: {model: db.estado},
            order: [['id_rol', 'DESC']]
        })

        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 
const cambiarEstadoRol = async (req, res) => {
    try {
        const id_rol = req.params.id;
        
        // Buscar el rol
        const rol = await db.roles.findByPk(id_rol, {
            include: { model: db.estado }
        });

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Cambiar el estado (1 = Activo, 2 = Inactivo)
        rol.id_estado = rol.id_estado === 1 ? 2 : 1;

        await rol.save();

        // Traer con la relación de estado actualizada
        const rolActualizado = await db.roles.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del rol' });
    }
};

// GET: Buscar personas por filtro
const buscarRol = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.roles.findAll({
            include: {model: db.estado},
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


const registrarRol = async (req, res) => {
    try {
        req.body.id_estado = req.body.estado?.id_estado;
        const persona = await db.roles.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

const modificarRol = async (req, res) => {
    try {
        const id_rol = req.params.id;
        const { nombre, id_estado } = req.body;

        const rol = await db.roles.findByPk(id_rol);
        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Update fields
        rol.nombre = nombre || rol.nombre;
        rol.id_estado = id_estado || rol.id_estado;

        await rol.save();

        // Fetch updated role with estado
        const rolActualizado = await db.roles.findByPk(id_rol, {
            include: { model: db.estado }
        });

        res.json(rolActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar rol' });
    }
};
 


module.exports = {listarRol, registrarRol, cambiarEstadoRol, buscarRol,modificarRol}