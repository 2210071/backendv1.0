const express = require('express');
const router = express.Router();

const {verificarToken} = require('../token/token');
const {listarPersonal,filtrarPorRol, buscarPersonal,  registrarPersonal, modificarPersonal} = require('../controladores/personalControlador')

router.get('/listarPersonal', verificarToken, listarPersonal)
router.post('/addPersonal', verificarToken, registrarPersonal);
router.get('/filtrarporRoll', verificarToken, filtrarPorRol);
router.get('/buscarPersonal', verificarToken, buscarPersonal);
router.put('/modPersonal/:id', verificarToken, modificarPersonal);
module.exports = router