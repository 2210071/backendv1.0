const express = require('express');
const router = express.Router();

const {verificarToken} = require('../token/token');
const {listarRol, registrarRol,buscarRol, cambiarEstadoRol, modificarRol} = require('../controladores/rolControlador')

router.get('/listarRol',verificarToken, listarRol),
router.put('/cambiarEstado/:id', verificarToken, cambiarEstadoRol);
router.get('/buscarRol', verificarToken, buscarRol);
router.post('/addRoles', verificarToken, registrarRol);
router.put('/modRoles/:id', verificarToken, modificarRol);

module.exports = router