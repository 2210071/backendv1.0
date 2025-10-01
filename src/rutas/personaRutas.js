const express = require('express');
const router = express.Router();

const {verificarToken} = require('../token/token');
const {listarPersona,cambiarEstadoPersona, FiltroReportePersona} = require('../controladores/personaControlador')
router.get('/FiltroReportePersona',verificarToken,FiltroReportePersona)
router.get('/listarPersona', verificarToken, listarPersona)
router.put('/cambiarEstadoPersona/:id', verificarToken, cambiarEstadoPersona);
module.exports = router