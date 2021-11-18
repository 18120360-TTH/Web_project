const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ISBN: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: "ISBN"
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    publisher: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    number_of_pages: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'books',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "ISBN",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ISBN" },
        ]
      },
    ]
  });
};
