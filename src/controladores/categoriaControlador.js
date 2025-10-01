const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarCategoria = async (req, res) => {
    try {
        const lista = await db.categoria.findAll({
            include: { model: db.imagen },
            order: [['id_categoria', 'DESC']]
        });
        return res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al listar categorías' });
    }
};

const buscarCategoria = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const categorias = await db.categoria.findAll({
            include: { model: db.imagen },
            where: {
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${filtro}%` } },
                ]
            }
        });
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar categorías' });
    }
};

const registrarCategoria = async (req, res) => {
    try {
        req.body.id_imagen = req.body.imagen?.id_imagen;
        const categoria = await db.categoria.create(req.body);
        const categoriaConImagen = await db.categoria.findByPk(categoria.id_categoria, {
            include: { model: db.imagen }
        });
        res.status(201).json(categoriaConImagen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar categoría' });
    }
};

const modificarCategoria = async (req, res) => {
    try {
        const id_categoria = req.params.id;
        const { nombre, descripcion, id_imagen } = req.body;

        const categoria = await db.categoria.findByPk(id_categoria);
        if (!categoria) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        // Update fields
        categoria.nombre = nombre || categoria.nombre;
        categoria.descripcion = descripcion || categoria.descripcion;
        if (id_imagen) {
            categoria.id_imagen = id_imagen;
        }

        await categoria.save();

        // Fetch updated category with imagen
        const categoriaActualizada = await db.categoria.findByPk(id_categoria, {
            include: { model: db.imagen }
        });

        res.json(categoriaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar categoría' });
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


const eliminarCategoria = async (req, res) => {
    try {
        const id = req.params.xcod;
        await db.categoria.destroy({ where: { id_categoria: id } });
        res.status(200).json({ mensaje: 'cate eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
}
module.exports = { listarCategoria, registrarCategoria, eliminarCategoria, subirImagen, buscarCategoria, modificarCategoria };