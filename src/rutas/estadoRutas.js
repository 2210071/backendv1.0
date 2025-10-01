const express = require('express');
const router = express.Router();

const {verificarToken} = require('../token/token');
const {listarEstado} = require('../controladores/estadoControlador')

router.get('/listarEstado',verificarToken, listarEstado),

module.exports = router