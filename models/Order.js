const Sequelize = require("sequelize");

module.exports = sequelize.define("Order", {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_Id: Sequelize.STRING,
    status: Sequelize.STRING(30),
    date: Sequelize.DATE
  }, {
    freezeTableName: true
  });