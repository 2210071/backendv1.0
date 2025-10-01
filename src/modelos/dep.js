const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dep', {
    id_dep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dep',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "dep_pkey",
        unique: true,
        fields: [
          { name: "id_dep" },
        ]
      },
    ]
  });
};
