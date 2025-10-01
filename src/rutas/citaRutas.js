const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const {listarCita, cambiarEstadoCita, registrarCita, modificarCita, FiltroReporteCita} = require('../controladores/citaControlador')

router.get('/listarCita', listarCita)
router.put('/cambiarEstadoCita/:id', verificarToken, cambiarEstadoCita);
router.get('/FiltroReporteCita',verificarToken,FiltroReporteCita)
router.post('/registrarCita', verificarToken, registrarCita);

router.put('/modificarCita', verificarToken, modificarCita);

module.exports = router