const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('taller', {
    id_taller: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudad',
        key: 'id_ciudad'
      }
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    des: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nit: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'taller',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "taller_pkey",
        unique: true,
        fields: [
          { name: "id_taller" },
        ]
      },
    ]
  });
};
