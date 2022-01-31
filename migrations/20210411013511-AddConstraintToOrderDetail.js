'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addConstraint('OrderDetail', {
        fields: ['order_id'],
        type: 'foreign key',  
        name: 'fk_orderDetail_order',
        references: {
          table: 'Order',
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
    return queryInterface.removeConstraint('OrderDetail', 'fk_orderDetail_order');
  }
};