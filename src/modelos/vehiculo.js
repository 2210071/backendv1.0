const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehiculo', {
    placa: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cliente',
        key: 'id_persona'
      }
    },
    id_modelo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'modelo',
        key: 'id_modelo'
      }
    },
    id_tipo_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipo_vehiculo',
        key: 'id_tipo_vehiculo'
      }
    },
    id_color: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'color',
        key: 'id_color'
      }
    }
  }, {
    sequelize,
    tableName: 'vehiculo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vehiculo_pkey",
        unique: true,
        fields: [
          { name: "placa" },
        ]
      },
    ]
  });
};
