const Sequelize = require("sequelize");

module.exports = sequelize.define("Inventory", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
  
    snack_Id: Sequelize.INTEGER(11).UNSIGNED,
    //category_id: Sequelize.INTEGER(11).UNSIGNED,
    quantity: Sequelize.INTEGER(11).UNSIGNED,
    unit_price: Sequelize.DOUBLE(10, 2).UNSIGNED,
    expire_date: Sequelize.DATEONLY,
    add_date: Sequelize.DATEONLY
  }, {
    freezeTableName: true
  });