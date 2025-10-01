const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('personal', {
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'persona',
        key: 'id_persona'
      }
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'imagen',
        key: 'id_imagen'
      },
      unique: "personal_id_imagen_key"
    }
  }, {
    sequelize,
    tableName: 'personal',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personal_id_imagen_key",
        unique: true,
        fields: [
          { name: "id_imagen" },
        ]
      },
      {
        name: "personal_pkey",
        unique: true,
        fields: [
          { name: "id_persona" },
        ]
      },
    ]
  });
};
