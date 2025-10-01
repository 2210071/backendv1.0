const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servicio', {
    id_servicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.STRING(40),
      allowNull: false
    },
    fecha_entrega: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'estado',
        key: 'id_estado'
      }
    },
    placa: {
      type: DataTypes.STRING(15),
      allowNull: false,
      references: {
        model: 'vehiculo',
        key: 'placa'
      }
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'personal',
        key: 'id_persona'
      }
    }
  }, {
    sequelize,
    tableName: 'servicio',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicio_pkey",
        unique: true,
        fields: [
          { name: "id_servicio" },
        ]
      },
    ]
  });
};
