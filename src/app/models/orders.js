const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      }
    },
    total_cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shipping_fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25
    },
    final_cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delivery_status: {
      type: DataTypes.ENUM('Prepare','ReadyToDeliver','Delivering','Complete'),
      allowNull: true,
      defaultValue: "Prepare"
    },
    payment_method: {
      type: DataTypes.ENUM('COD'),
      allowNull: true
    },
    customer_phone_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    customer_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    expected_arriving_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
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
        name: "customer_username",
        using: "BTREE",
        fields: [
          { name: "customer_username" },
        ]
      },
    ]
  });
};
