const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const {listarVehiculo, registrarVehiculo,  buscarVehiculo,listarColor, FiltroReporteVehiculo,
    listarModelo, listarTipo, modificarVehiculo, filtrarModeloPorMarca, eliminarVehiculo} = require('../controladores/vehiculoControlador')

router.get('/listarVehiculo', verificarToken, listarVehiculo);
router.get('/listarModelo', verificarToken, listarModelo);
router.get('/listarTipo', verificarToken, listarTipo);
router.get('/FiltroReporteVehiculo',verificarToken,FiltroReporteVehiculo)
router.get('/listarColor', verificarToken, listarColor);
router.post('/registrarVehiculo', verificarToken, registrarVehiculo);
router.get('/buscarVehiculo', verificarToken, buscarVehiculo);
router.put('/modificarVehiculo/:id', verificarToken, modificarVehiculo);
router.get('/filtrarModeloPorMarca', verificarToken, filtrarModeloPorMarca);
router.delete('/eliminarVehiculo/:xcod',verificarToken, eliminarVehiculo);

module.exports = router