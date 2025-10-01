const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencategoria');
const {listarCategoria,buscarCategoria, eliminarCategoria,  registrarCategoria, subirImagen,modificarCategoria} = require('../controladores/categoriaControlador')

router.get('/listarCategoria',  listarCategoria)
router.get('/buscarCategoria',  buscarCategoria);
router.post('/registrarCategoria', verificarToken, registrarCategoria);
router.post('/subirImagen', verificarToken, upload.single('imagen'), subirImagen);
router.put('/modificarCategoria/:id', verificarToken, modificarCategoria);
router.delete('/eliminarCategoria/:xcod',verificarToken, eliminarCategoria);
module.exports = router