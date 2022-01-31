'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("Inventory", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      snack_Id: Sequelize.INTEGER(11),
      //category_id: Sequelize.INTEGER(11).UNSIGNED,
      quantity: Sequelize.INTEGER(11).UNSIGNED,
      unit_price: Sequelize.DOUBLE(10, 2).UNSIGNED,
      expire_date: Sequelize.DATEONLY,
      add_date: Sequelize.DATEONLY,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    }
    );
  },

  down: (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("Inventory")
  }
};
