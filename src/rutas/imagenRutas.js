const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');

const {listarImagen, registrarImagen} = require('../controladores/imagenControlador')

router.get('/listarImagen', verificarToken, listarImagen)
router.post('/registrarImagen', verificarToken, registrarImagen);

module.exports = router