const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('color', {
    id_color: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'color',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "color_pkey",
        unique: true,
        fields: [
          { name: "id_color" },
        ]
      },
    ]
  });
};
