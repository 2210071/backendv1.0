const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estado', {
    id_estado: {
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
    tableName: 'estado',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "estado_pkey",
        unique: true,
        fields: [
          { name: "id_estado" },
        ]
      },
    ]
  });
};
