const Sequelize = require("sequelize");

module.exports = sequelize.define("Snack", {
    snack_Id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    category_id: Sequelize.INTEGER(11).UNSIGNED,
    name: Sequelize.STRING(30),
    image_url: Sequelize.STRING,
    vote_count: Sequelize.INTEGER(11).UNSIGNED,
    status: Sequelize.STRING(30),
  }, {
    freezeTableName: true
  });