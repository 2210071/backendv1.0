const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencatalogo');
const {listarCiudad} = require('../controladores/ciudadControlador')

router.get('/listarCiudad', verificarToken, listarCiudad)


module.exports = router