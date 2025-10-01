var DataTypes = require("sequelize").DataTypes;
var _catalogo = require("./catalogo");
var _categoria = require("./categoria");
var _cita = require("./cita");
var _ciudad = require("./ciudad");
var _cliente = require("./cliente");
var _color = require("./color");
var _dep = require("./dep");
var _detalle_servicio = require("./detalle_servicio");
var _estado = require("./estado");
var _factura = require("./factura");
var _imagen = require("./imagen");
var _marca = require("./marca");
var _modelo = require("./modelo");
var _mpago = require("./mpago");
var _persona = require("./persona");
var _personal = require("./personal");
var _roles = require("./roles");
var _servicio = require("./servicio");
var _taller = require("./taller");
var _tipo_vehiculo = require("./tipo_vehiculo");
var _usuario = require("./usuario");
var _vehiculo = require("./vehiculo");

function initModels(sequelize) {
  var catalogo = _catalogo(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var cita = _cita(sequelize, DataTypes);
  var ciudad = _ciudad(sequelize, DataTypes);
  var cliente = _cliente(sequelize, DataTypes);
  var color = _color(sequelize, DataTypes);
  var dep = _dep(sequelize, DataTypes);
  var detalle_servicio = _detalle_servicio(sequelize, DataTypes);
  var estado = _estado(sequelize, DataTypes);
  var factura = _factura(sequelize, DataTypes);
  var imagen = _imagen(sequelize, DataTypes);
  var marca = _marca(sequelize, DataTypes);
  var modelo = _modelo(sequelize, DataTypes);
  var mpago = _mpago(sequelize, DataTypes);
  var persona = _persona(sequelize, DataTypes);
  var personal = _personal(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var servicio = _servicio(sequelize, DataTypes);
  var taller = _taller(sequelize, DataTypes);
  var tipo_vehiculo = _tipo_vehiculo(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);
  var vehiculo = _vehiculo(sequelize, DataTypes);

  detalle_servicio.belongsTo(catalogo, {  foreignKey: "id_catalogo"});
  catalogo.hasMany(detalle_servicio, {  foreignKey: "id_catalogo"});
  catalogo.belongsTo(categoria, { as: "categoria", foreignKey: "id_categoria"});
  categoria.hasMany(catalogo, { foreignKey: "id_categoria"});
  taller.belongsTo(ciudad, {  foreignKey: "id_ciudad"});
  ciudad.hasMany(taller, {  foreignKey: "id_ciudad"});
  vehiculo.belongsTo(cliente, {  foreignKey: "id_persona"});
  cliente.hasMany(vehiculo, {  foreignKey: "id_persona"});
  vehiculo.belongsTo(color, {  foreignKey: "id_color"});
  color.hasMany(vehiculo, {  foreignKey: "id_color"});
  ciudad.belongsTo(dep, {  foreignKey: "id_dep"});
  dep.hasMany(ciudad, {  foreignKey: "id_dep"});
  catalogo.belongsTo(estado, {  foreignKey: "id_estado"});
  estado.hasMany(catalogo, {  foreignKey: "id_estado"});
  cita.belongsTo(estado, {  foreignKey: "id_estado"});
  estado.hasMany(cita, {  foreignKey: "id_estado"});
  factura.belongsTo(estado, {  foreignKey: "id_estado"});
  estado.hasMany(factura, {  foreignKey: "id_estado"});
  persona.belongsTo(estado, {  foreignKey: "id_estado"});
  estado.hasMany(persona, {  foreignKey: "id_estado"});
  roles.belongsTo(estado, {  foreignKey: "id_estado"});
  estado.hasMany(roles, {  foreignKey: "id_estado"});
  servicio.belongsTo(estado, { foreignKey: "id_estado"});
  estado.hasMany(servicio, { foreignKey: "id_estado"});
  catalogo.belongsTo(imagen, {  foreignKey: "id_imagen"});
  imagen.hasOne(catalogo, {  foreignKey: "id_imagen"});
  categoria.belongsTo(imagen, { foreignKey: "id_imagen"});
  imagen.hasOne(categoria, { foreignKey: "id_imagen"});
  personal.belongsTo(imagen, {  foreignKey: "id_imagen"});
  imagen.hasOne(personal, {  foreignKey: "id_imagen"});
  modelo.belongsTo(marca, {  foreignKey: "id_marca"});
  marca.hasMany(modelo, {  foreignKey: "id_marca"});
  vehiculo.belongsTo(modelo, {  foreignKey: "id_modelo"});
  modelo.hasMany(vehiculo, {  foreignKey: "id_modelo"});
  factura.belongsTo(mpago, {  foreignKey: "id_met"});
  mpago.hasMany(factura, {  foreignKey: "id_met"});
  cliente.belongsTo(persona, {  foreignKey: "id_persona"});
  persona.hasOne(cliente, {  foreignKey: "id_persona"});
  personal.belongsTo(persona, {  foreignKey: "id_persona"});
  persona.hasOne(personal, {  foreignKey: "id_persona"});
  servicio.belongsTo(personal, {  foreignKey: "id_persona"});
  personal.hasMany(servicio, {  foreignKey: "id_persona"});
  usuario.belongsTo(personal, {  foreignKey: "id_persona"});
  personal.hasOne(usuario, {  foreignKey: "id_persona"});
  persona.belongsTo(roles, { foreignKey: "id_rol", as :"roles"});
  roles.hasMany(persona, {  foreignKey: "id_rol"});
  detalle_servicio.belongsTo(servicio, {  foreignKey: "id_servicio"});
  servicio.hasMany(detalle_servicio, {  foreignKey: "id_servicio"});
  factura.belongsTo(servicio, {  foreignKey: "id_servicio"});
  servicio.hasMany(factura, { foreignKey: "id_servicio", as:"factura"});
  factura.belongsTo(taller, {  foreignKey: "id_taller"});
  taller.hasMany(factura, {  foreignKey: "id_taller"});
  vehiculo.belongsTo(tipo_vehiculo, {foreignKey: "id_tipo_vehiculo"});
  tipo_vehiculo.hasMany(vehiculo, {  foreignKey: "id_tipo_vehiculo"});
  cita.belongsTo(vehiculo, {  foreignKey: "placa"});
  vehiculo.hasMany(cita, {  foreignKey: "placa"});
  servicio.belongsTo(vehiculo, {  foreignKey: "placa"});
  vehiculo.hasMany(servicio, {  foreignKey: "placa"});

  return {
    catalogo,
    categoria,
    cita,
    ciudad,
    cliente,
    color,
    dep,
    detalle_servicio,
    estado,
    factura,
    imagen,
    marca,
    modelo,
    mpago,
    persona,
    personal,
    roles,
    servicio,
    taller,
    tipo_vehiculo,
    usuario,
    vehiculo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
