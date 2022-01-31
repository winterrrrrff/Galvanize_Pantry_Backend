'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addConstraint('Order', {
        fields: ['user_Id'],
        type: 'foreign key',
        name: 'fk_orders_users',
        references: {
          table: 'User',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeConstraint('Order', 'fk_orders_users');
  }
};
