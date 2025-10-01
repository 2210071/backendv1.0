const express = require('express');
const router = express.Router();
const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencatalogo');
const {listarCatalogo, cambiarEstadoCatalogo, buscarcatalogo, listarCatalogoID, FiltroReporteCatalogo,
    registrarCatalogo, subirImagen,modificarCatalogo, filtrarPorCategoria} = require('../controladores/catalogoControlador')

router.get('/listarCatalogo', listarCatalogo)
router.get('/FiltroReporteCatalogo',verificarToken,FiltroReporteCatalogo)
router.put('/cambiarEstadoCatalogo/:id', verificarToken, cambiarEstadoCatalogo);
router.get('/buscarCatalogo', verificarToken, buscarcatalogo);
router.post('/registrarCatalogo', verificarToken, registrarCatalogo);
router.post('/subirImagenA', verificarToken, upload.single('imagen'), subirImagen);
router.get('/listarCatalogoID/:id_categoria', listarCatalogoID);
router.put('/modificarCatalogo/:id', verificarToken, modificarCatalogo);
router.get('/filtrarporCategoria', verificarToken, filtrarPorCategoria);

module.exports = router