const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mpago', {
    id_met: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'mpago',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mpago_pkey",
        unique: true,
        fields: [
          { name: "id_met" },
        ]
      },
    ]
  });
};
