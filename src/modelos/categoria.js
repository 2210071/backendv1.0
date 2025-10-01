const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categoria', {
    id_categoria: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'imagen',
        key: 'id_imagen'
      },
      unique: "categoria_id_imagen_key"
    }
  }, {
    sequelize,
    tableName: 'categoria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categoria_id_imagen_key",
        unique: true,
        fields: [
          { name: "id_imagen" },
        ]
      },
      {
        name: "categoria_pkey",
        unique: true,
        fields: [
          { name: "id_categoria" },
        ]
      },
    ]
  });
};
