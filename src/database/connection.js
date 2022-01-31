/* connection/js */

const Sequelize = require("sequelize");

 const sequelize = new Sequelize("MyDataBase", "root", "!985Jinlizhong", {
     host: "localhost",
     port: 3306,
     dialect: "mysql",
     operatorsAliases: 0
 });

module.exports = sequelize;

global.sequelize = sequelize;
