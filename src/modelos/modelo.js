const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modelo', {
    id_modelo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    id_marca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'marca',
        key: 'id_marca'
      }
    }
  }, {
    sequelize,
    tableName: 'modelo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "modelo_pkey",
        unique: true,
        fields: [
          { name: "id_modelo" },
        ]
      },
    ]
  });
};
