const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { db } = require('../config/database');
const { factura, servicio } = db;

const {verificarToken} = require('../token/token');
const upload = require('../imagenes/imagencatalogo');
const {listarFactura, registrarFactura} = require('../controladores/facturaControlador')

router.get('/listarFactura',verificarToken, listarFactura)
router.post('/registrarFactura',verificarToken, registrarFactura);


router.get('/factura/servicio/:id_servicio/pdf', async (req, res) => {
  const { id_servicio } = req.params;

  try {
 const facturaEncontrada = await factura.findOne({ where: { id_servicio } });
    if (!facturaEncontrada) {
      return res.status(404).json({ error: 'Factura no encontrada para este servicio' });
    }

    const carpeta = path.join(__dirname, '../facturas_xml');
    const rutaArchivoPDF = path.join(carpeta, `factura_${facturaEncontrada.id_factura}.pdf`);

    if (fs.existsSync(rutaArchivoPDF)) {
      res.download(rutaArchivoPDF, `factura_${facturaEncontrada.id_factura}.pdf`);
    } else {
      res.status(404).json({ error: 'PDF no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


module.exports = router