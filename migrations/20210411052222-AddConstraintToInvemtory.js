'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addConstraint('Inventory', {
        fields: ['snack_Id'],
        type: 'foreign key',  
        name: 'fk_inventory_snack',
        references: {
          table: 'Snack',
          field: 'snack_Id'
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
    return queryInterface.removeConstraint('Inventory', 'fk_inventory_snack');
  }
};