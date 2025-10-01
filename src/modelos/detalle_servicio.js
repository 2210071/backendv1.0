const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_servicio', {
    id_detser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicio',
        key: 'id_servicio'
      }
    },
    id_catalogo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'catalogo',
        key: 'id_catalogo'
      }
    },
    obs: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'detalle_servicio',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalle_servicio_pkey",
        unique: true,
        fields: [
          { name: "id_detser" },
        ]
      },
    ]
  });
};
