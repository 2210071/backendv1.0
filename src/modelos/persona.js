const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('persona', {
    id_persona: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ap_paterno: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ap_materno: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cedula: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id_rol'
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
    tableName: 'persona',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "persona_pkey",
        unique: true,
        fields: [
          { name: "id_persona" },
        ]
      },
    ]
  });
};
