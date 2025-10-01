const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario', {
    usuario: {
      type: DataTypes.STRING(40),
      allowNull: false,
      primaryKey: true
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personal',
        key: 'id_persona'
      },
      unique: "usuario_id_persona_key"
    }
  }, {
    sequelize,
    tableName: 'usuario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usuario_id_persona_key",
        unique: true,
        fields: [
          { name: "id_persona" },
        ]
      },
      {
        name: "usuario_pkey",
        unique: true,
        fields: [
          { name: "usuario" },
        ]
      },
    ]
  });
};
