
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require("node-cron");
const { actualizarCitasVencidas } = require("./src/controladores/citaControlador");
dotenv.config()

const allowedOrigins = [
  'https://fron-end-v3-3.onrender.com',
  'http://localhost:4200',
  'https://localhost'
];

app.use(cors({
  origin: function(origin, callback) {
    console.log(`🌐 Solicitud recibida desde origen: ${origin || '[sin origen]'}`);

    if (!origin) {
      console.log('✅ Se permitió acceso sin origen (ej. curl o apps nativas)');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origen permitido: ${origin}`);
      return callback(null, true);
    } else {
      console.warn(`❌ Origen NO permitido: ${origin}`);
      return callback(new Error('CORS Error: Origen no permitido - ' + origin), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))


// Cron para actualizar citas vencidas cada 5 minutos
cron.schedule("*/5 * * * *", () => {
  actualizarCitasVencidas();
});
actualizarCitasVencidas();


//cualquier api que hagas al servidor siempre va pasar pruimero por este archivo app.js de aqui se rediriguen a las rutas
app.get('/', (req, res) => {
    res.send('API  funcionando correctamente');
});

// Middleware para analizar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// app - rutas(aproabdo por token) - recienpasa a controladores
const rolRoute = require('./src/rutas/rolRutas')
app.use('/api',rolRoute)

//persona
const personaRoute = require('./src/rutas/personaRutas')
app.use('/api',personaRoute)

//usuario
const usuarioRoute = require('./src/rutas/usuarioRutas')
app.use('/api',usuarioRoute)

//imagenes
const imagenoRoute = require('./src/rutas/imagenRutas')
app.use('/api',imagenoRoute)

//categoria
const cateRoute = require('./src/rutas/categoriaRutas')
app.use('/api',cateRoute)

app.use('/imagenCategoria', express.static(path.join(__dirname, './src/imagenes/imgCategoria')));

//catalogo
const cataRoute = require('./src/rutas/catalogoRutas')
app.use('/api',cataRoute)

app.use('/imagenCatalogo', express.static(path.join(__dirname, './src/imagenes/imgCatalogo')));

//Vehiculo
const vehiculoRoute = require('./src/rutas/vehiculoRutas')
app.use('/api',vehiculoRoute)

const tallerRoute = require('./src/rutas/tallerRutas')
app.use('/api',tallerRoute)
const facturaRoute = require('./src/rutas/facturaRutas')
app.use('/api',facturaRoute)

const estadoRoute = require('./src/rutas/estadoRutas')
app.use('/api',estadoRoute)

const mpagoRoute = require('./src/rutas/mpagoRutas')
app.use('/api',mpagoRoute)

const ciudadRoute = require('./src/rutas/ciudadRutas')
app.use('/api',ciudadRoute)

const clienteRoute = require('./src/rutas/clienteRutas')
app.use('/api',clienteRoute)

const personalRoute = require('./src/rutas/personalRutas')
app.use('/api',personalRoute)
const citaRoute = require('./src/rutas/citaRutas')
app.use('/api',citaRoute)
//servicio
const serRoute = require('./src/rutas/servicioRutas')
app.use('/api',serRoute)
//reporte
const reporRoute = require('./src/rutas/reporteRutas')
app.use('/api',reporRoute)

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
