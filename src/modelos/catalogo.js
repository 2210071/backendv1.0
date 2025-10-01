const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('catalogo', {
    id_catalogo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(20),
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
    descripcion: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'id_categoria'
      }
    },
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'imagen',
        key: 'id_imagen'
      },
      unique: "catalogo_id_imagen_key"
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
    tableName: 'catalogo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "catalogo_id_imagen_key",
        unique: true,
        fields: [
          { name: "id_imagen" },
        ]
      },
      {
        name: "catalogo_pkey",
        unique: true,
        fields: [
          { name: "id_catalogo" },
        ]
      },
    ]
  });
};
