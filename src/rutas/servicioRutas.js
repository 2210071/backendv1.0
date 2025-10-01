const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const {listarServicio, buscarServicio, cambiarEstadoServicio, listardetServicio,listardetServicioID,
     registrarServicio, registrardetServicio,FiltroReporteServicio, modificarServicio, eliminarDetalleServcio,
filtrarPorEstado} = require('../controladores/servicioControlador')

router.get('/listarServicio', verificarToken, listarServicio);
router.get('/FiltroReporteServicio',verificarToken,FiltroReporteServicio)
router.get('/listardetServicio', verificarToken, listardetServicio);
router.post('/registrarServicio', verificarToken, registrarServicio);
router.post('/registrardetServicio', verificarToken, registrardetServicio);
router.get('/listardetServicioID/:id_servicio',verificarToken, listardetServicioID);
router.put('/cambiarEstadoServicio/:id', verificarToken, cambiarEstadoServicio);
router.get('/buscarServicio', verificarToken, buscarServicio);
router.put('/modificarServicio', verificarToken, modificarServicio);
router.get('/filtrarPorEstado', verificarToken, filtrarPorEstado);
router.delete('/eliminarServicio/:xcod',verificarToken, eliminarDetalleServcio);
module.exports = router