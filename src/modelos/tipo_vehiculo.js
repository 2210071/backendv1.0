const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipo_vehiculo', {
    id_tipo_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tipo_vehiculo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tipo_vehiculo_pkey",
        unique: true,
        fields: [
          { name: "id_tipo_vehiculo" },
        ]
      },
    ]
  });
};
