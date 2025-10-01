const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cita', {
    id_cita: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    registrado: {
      type: DataTypes.STRING(40),
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
    fecha_c: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_c: {
      type: DataTypes.TIME,
      allowNull: false
    },
    obs: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: 'vehiculo',
        key: 'placa'
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
    tableName: 'cita',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cita_pkey",
        unique: true,
        fields: [
          { name: "id_cita" },
        ]
      },
    ]
  });
};
