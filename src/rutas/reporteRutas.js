const express = require('express');
const router = express.Router();
const { verificarToken } = require('../token/token');
const { filtrarPorRol, buscarServicio } = require('../controladores/reporteControlador');

router.get('/filtrarporRol', verificarToken, filtrarPorRol);
router.get('/buscarServicio', verificarToken, buscarServicio);
module.exports = router;
