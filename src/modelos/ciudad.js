const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ciudad', {
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    id_dep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dep',
        key: 'id_dep'
      }
    }
  }, {
    sequelize,
    tableName: 'ciudad',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ciudad_pkey",
        unique: true,
        fields: [
          { name: "id_ciudad" },
        ]
      },
    ]
  });
};
