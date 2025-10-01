const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencatalogo');
const { listarTaller, modificarTaller } = require('../controladores/tallerControlador')

router.get('/listarTaller', listarTaller)
router.put('/modificarTaller/:id', verificarToken, modificarTaller);


module.exports = router