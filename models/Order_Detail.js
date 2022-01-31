const Sequelize = require("sequelize");

module.exports = sequelize.define("OrderDetail", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: Sequelize.INTEGER(11).UNSIGNED,
    snack_id: Sequelize.INTEGER(11).UNSIGNED,
    quantity: Sequelize.INTEGER(11).UNSIGNED,
    unit_price: Sequelize.DOUBLE(10,2).UNSIGNED,
    total_price: Sequelize.DOUBLE(10,2).UNSIGNED
  }, {
    freezeTableName: true
  });