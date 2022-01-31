const Sequelize = require("sequelize");

module.exports = sequelize.define("Category", {
    category_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    name: Sequelize.STRING(30)
  }, {
    freezeTableName: true
  });