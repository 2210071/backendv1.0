const db = require('../config/database');
const express = require('express');
const {verificarToken} = require('../token/token');
const { IniciarSesion, modificarUsuario, registrarUsuario , listarUsuario} = require('../controladores/usuarioControlador');
const router = express.Router();
router.put('/modificarUsuario/:id', verificarToken, modificarUsuario);
router.post('/iniciarsesion', IniciarSesion); 
router.get('/listarUsuario',verificarToken, listarUsuario )

module.exports = router;