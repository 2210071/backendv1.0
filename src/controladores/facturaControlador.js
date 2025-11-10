const { db } = require("../config/database");
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const num = require("numero-a-letras");
console.log(num)

const generarCUF = (longitud = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
    let result = '';
    for (let i = 0; i < longitud; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generarPDFFactura = async (factura) => {
    const carpeta = path.join(__dirname, '..', 'facturas_xml');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

    const servicio = await factura.getServicio({ 
     include: [
    {
      model: factura.sequelize.models.detalle_servicio,
      include: [
        {
          model: factura.sequelize.models.catalogo,
          attributes: ['nombre']  // Solo traemos el nombre
        }
      ]
    },
    {
      model: factura.sequelize.models.vehiculo,   // Vehículo principal
      include: [
        {
          model: factura.sequelize.models.cliente,   // Cliente dueño del vehículo
          include: [factura.sequelize.models.persona] // Persona (datos del cliente)
        },
        {
          model: factura.sequelize.models.modelo    // Modelo del vehículo
        },
        {
          model: factura.sequelize.models.tipo_vehiculo // Tipo de vehículo
        }
      ]
    }
  ]
    
    });
    // Traer taller con ciudad y dep
  const taller = await factura.getTaller({
    include: [
      {
        model: factura.sequelize.models.ciudad,
        include: [factura.sequelize.models.dep]
      }
    ]
  });

    const vehiculo = servicio.vehiculo;
    const modelo = vehiculo.modelo;
     const tipo_vehiculo = vehiculo.tipo_vehiculo;
     
     const cliente = vehiculo.cliente.persona;
     const detalles = servicio.detalle_servicios || [];



    const nombreArchivoPDF = `factura_${factura.id_factura}.pdf`;
    const rutaArchivoPDF = path.join(carpeta, nombreArchivoPDF);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(fs.createWriteStream(rutaArchivoPDF));

    const colorTexto = 'black';  // ahora todo negro
    const yEncabezado = 50;

    // ===== Encabezado: 3 columnas =====
    const xIzquierda = 50;
    const xCentro = 200;
    const xDerecha = 400;

    // Columna izquierda: Casa matriz
    doc.fontSize(8).fillColor(colorTexto);
    doc.text('Mecánica Automotriz Germán Pereira', xIzquierda, yEncabezado);
     doc.text('CASA MATRIZ', xIzquierda, yEncabezado+12);
    doc.text('No Punto de venta 0', xIzquierda, yEncabezado + 24);
    doc.text(`${taller.direccion}`, xIzquierda, yEncabezado + 36);
    doc.text(`Teléfono: ${taller.telefono}`, xIzquierda, yEncabezado + 48);
    doc.text('Tarija - Bolivia', xIzquierda, yEncabezado + 60);

    // Columna central: Título centrado
    doc.fillColor(colorTexto).fontSize(10).text('FACTURA', xCentro, yEncabezado + 57, {
        width: 150,
        align: 'center',
        underline: true
    });
    doc.fontSize(7).text('(con derecho a crédito fiscal)', xCentro, yEncabezado + 71, {
        width: 150,
        align: 'center'
    });

    // Columna derecha: NIT, Factura y CUF
    const xEtiqueta = xDerecha;
    const xValor = xDerecha + 100;
    let yInicio = yEncabezado;

    doc.fontSize(8).fillColor(colorTexto);
    doc.text('NIT:', xEtiqueta, yInicio);
    doc.text('FACTURA No:', xEtiqueta, yInicio + 12);
    doc.text('COD.AUTORIZACION:', xEtiqueta, yInicio + 24);

    doc.fillColor(colorTexto);
    doc.text(`${taller.nit}`, xValor, yInicio);
    doc.text(`${factura.id_factura}`, xValor, yInicio + 12);

    const cuf = factura.cuf.replace(/[\r\n]+/g, '').trim();
    doc.text(cuf, xValor, yInicio + 24);

   
// ===== Datos del Cliente y del Negocio en 3 columnas =====
const yDatosCliente = yEncabezado + 90;

// Columnas
const xCol1 = 50;   // izquierda
const xCol2 = 220;  // centro
const xCol3 = 390;  // derecha
const espacioFila1 = 12; // espacio vertical más compacto

doc.fontSize(8).fillColor(colorTexto);

// Columna 1: Cliente
doc.text(`Cód. Cliente: ${cliente.id_persona}`, xCol1, yDatosCliente);

// Fecha al lado derecho del código del cliente
const anchoCodigo = doc.widthOfString(`Cód. Cliente: ${cliente.id_persona}`) + 10; 
doc.text(`Fecha: ${cliente.fecha} ${cliente.hora}`, xCol1 + anchoCodigo, yDatosCliente);

doc.text(`Nombre/Razon Social: ${cliente.nombre} ${cliente.ap_paterno} ${cliente.ap_materno || ''}`, xCol1, yDatosCliente + espacioFila1);
doc.text(`NIT/CI/CEX: ${cliente.cedula}`, xCol1, yDatosCliente + 2 * espacioFila1);

// Columna 2: Teléfono y vehiculo
doc.text(`Teléfono: ${cliente.telefono}`, xCol2, yDatosCliente + espacioFila1);

doc.text(`Tipo Vehiculo: ${tipo_vehiculo.nombre}`, xCol3, yDatosCliente);
doc.text(`Modelo: ${modelo.nombre}`, xCol3, yDatosCliente + espacioFila1);
doc.text(`Placa: ${vehiculo.placa}`, xCol3, yDatosCliente + 2 * espacioFila1);


// ===== tabla de productos vendidos =====
    const yTabla = yEncabezado + 130;
    const xNro = 50;
    const xNombre = 80;
    const xPrecioU = 300;
    const xDescuento = 360;
    const xSubTotal = 420;
    const espacioFila = 20;

    // Encabezado tabla
    doc.fontSize(8).fillColor(colorTexto)
       .text('Nro', xNro, yTabla)
       .text('Servicio', xNombre, yTabla)
       .text('Precio U', xPrecioU, yTabla)
       .text('Descuento', xDescuento, yTabla)
       .text('Sub Total', xSubTotal, yTabla);

    doc.moveTo(xNro, yTabla + 12).lineTo(xSubTotal + 60, yTabla + 12).stroke();

    // 🔹 Dibujamos los productos reales
    let yFila = yTabla + 20;
    let nro = 1;
    let subtotal = 0;
    let descuentoTotal = 0;

    for (const det of detalles) {
    const nombreServicio = det.catalogo?.nombre || '---'; 
    const precioUnit = det.precio; 
    const desc = det.descuento || 0; 
    const sub = precioUnit - desc;

    doc.text(nro, xNro, yFila);
    doc.text(nombreServicio, xNombre, yFila);
    doc.text(precioUnit.toFixed(2), xPrecioU, yFila);
    doc.text(desc.toFixed(2), xDescuento, yFila);
    doc.text(sub.toFixed(2), xSubTotal, yFila);

    subtotal += precioUnit;
    descuentoTotal += desc;

    nro++;
    yFila += espacioFila;
}

// ===== Totales debajo de la tabla =====
    const yTotales = yFila + 10;
    const xLabel = 300;
    const xValue = 420;

    const total = subtotal - descuentoTotal;
    const tasas = 0;
    const montoPagar = total - tasas;

    doc.text('Subtotal Bs:.', xLabel, yTotales);
    doc.text(subtotal.toFixed(2), xValue, yTotales);

    doc.text('Descuento Bs.:', xLabel, yTotales + 15);
    doc.text(descuentoTotal.toFixed(2), xValue, yTotales + 15);

    doc.text('Total Bs:.', xLabel, yTotales + 30);
    doc.text(total.toFixed(2), xValue, yTotales + 30);

    doc.text('Monto Gift Card:', xLabel, yTotales + 45);
    doc.text(tasas.toFixed(2), xValue, yTotales + 45);

    doc.text('Monto a Pagar Bs.:', xLabel, yTotales + 60);
    doc.text(montoPagar.toFixed(2), xValue, yTotales + 60);

    doc.text('Importe Base Crédito Fiscal:', xLabel, yTotales + 75);
    doc.text(total.toFixed(2), xValue, yTotales + 75);

// precio literal
 const yLiteral = yTotales + 100;
let montoLiteral = num.NumerosALetras(montoPagar);
montoLiteral = montoLiteral.replace(/Pesos/gi, 'Bolivianos');

doc.fontSize(8).text(`Son: ${montoLiteral}`, xNro, yLiteral);

 // Posición debajo del monto literal
const ySimulado = yLiteral + 25; // ajusta según espacio disponible
const fechaActual = new Date();

// Primer párrafo: mensaje legal / advertencia
const mensajeLegal = `ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS EL USO ILICITO SERA SANCIONADO PENALMENTE 
DE ACUERDO A LEY,
Ley No 453: Tenes derecho a recibe eformación crescernicas y contenidos de servicos que utilices.
"Este documento es la Representacion Grafica de un Documento Fiscal Digital emitido en una modalidad de
 facturación en linea"
`;

// Segundo párrafo: información de la transacción en una sola línea
const mensajeTransaccion = `Fecha: ${fechaActual.toLocaleDateString()} | Hora: ${fechaActual.toLocaleTimeString()} | Tipo de pago: efectivo | Generado por MAD`;

// Definir coordenadas del QR (lado izquierdo)
const xQR = 50; // margen izquierdo
const yQR = ySimulado - 13;

// Generar QR simulado
const qrData = `Factura simulada - MAD - ID Factura: ${factura.id_factura}`;
const qrBuffer = await QRCode.toBuffer(qrData, { type: 'png', errorCorrectionLevel: 'H' });
doc.image(qrBuffer, xQR, yQR, { width: 100, height: 100 });

// Definir coordenadas para los textos (lado derecho del QR)
const xTexto = xQR + 120; // deja espacio entre QR y texto
const yTexto = ySimulado;

// Agregar primer párrafo al PDF (lado derecho del QR)
doc.fontSize(8)
   .fillColor('black')
   .text(mensajeLegal, xTexto, yTexto, { width: 500, lineGap: 2 });

// Ajustar posición vertical para el segundo párrafo
const yTransaccion = yTexto + 65; // ajusta según altura del primer párrafo
doc.fontSize(8)
   .fillColor('gray')
   .text(mensajeTransaccion, xTexto, yTransaccion, { width: 500, lineGap: 2 });

// aqui debe terminad pie de pagina
    doc.end();
    return rutaArchivoPDF;
};

// POST: Registrar persona
const registrarFactura = async (req, res) => {
    try {
         req.body.id_servicio = req.body.servicio?.id_servicio;
          req.body.id_taller = req.body.taller?.id_taller;
           req.body.id_met = req.body.mpago?.id_met;
           req.body.id_estado = req.body.estado?.id_estado;
           req.body.cuf = generarCUF();
        const categoria = await db.factura.create(req.body);
        if (req.body.id_servicio) {
      // Traemos el servicio
      const servicio = await db.servicio.findByPk(req.body.id_servicio);

      if (servicio) {
        // Cambiar directamente el campo id_estado a 3 (Completado)
        if (servicio.id_estado === 1) {  // solo si está Activo
          servicio.id_estado = 3;
          await servicio.save();  // guarda el cambio
        }
      }
    }
         const rutaPDF = await generarPDFFactura(categoria);
        res.status(201).json({categoria, rutaPDF});
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

const listarFactura = async (req, res) =>{
    try {
        const lista = await db.factura.findAll({
            include: [
              {model: db.servicio},
              

            ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 


module.exports = {listarFactura, registrarFactura}