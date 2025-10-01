const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencatalogo');
const {listarMetodo_pago} = require('../controladores/metodopagoControlador')
router.get('/listarMetodo_pago', verificarToken, listarMetodo_pago)
module.exports = router