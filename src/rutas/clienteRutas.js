const express = require('express');
const router = express.Router();

const {verificarToken} = require('../token/token');
const {listarCliente, buscarCliente,  registrarCliente, modificarCliente} = require('../controladores/clienteControlador')

router.get('/listarCliente', verificarToken, listarCliente)
router.post('/addCliente', verificarToken, registrarCliente);
router.get('/buscarCliente', verificarToken, buscarCliente);
router.put('/modCliente/:id', verificarToken, modificarCliente);
module.exports = router