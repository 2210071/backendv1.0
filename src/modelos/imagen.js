const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imagen', {
    id_imagen: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'imagen',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "imagen_pkey",
        unique: true,
        fields: [
          { name: "id_imagen" },
        ]
      },
    ]
  });
};
