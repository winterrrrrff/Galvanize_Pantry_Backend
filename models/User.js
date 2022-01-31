const Sequelize = require("sequelize");

module.exports = sequelize.define("User", {
    // id: {
    //   type: Sequelize.INTEGER(11).UNSIGNED,
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    source: Sequelize.STRING(30),
    source_account: Sequelize.STRING(30),
    token: Sequelize.STRING(30),
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    image_url: Sequelize.STRING,
    email: Sequelize.STRING
  }, {
    freezeTableName: true
  });

