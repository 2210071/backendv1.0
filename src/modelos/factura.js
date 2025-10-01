const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factura', {
    id_factura: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cuf: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    registrado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicio',
        key: 'id_servicio'
      }
    },
    id_met: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mpago',
        key: 'id_met'
      }
    },
    id_taller: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'taller',
        key: 'id_taller'
      }
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'estado',
        key: 'id_estado'
      }
    }
  }, {
    sequelize,
    tableName: 'factura',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "factura_pkey",
        unique: true,
        fields: [
          { name: "id_factura" },
        ]
      },
    ]
  });
};
