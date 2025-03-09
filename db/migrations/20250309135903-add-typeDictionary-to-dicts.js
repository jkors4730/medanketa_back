'use strict';



import { DataTypes } from 'sequelize'

export default {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const [exists]  = await queryInterface.sequelize.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'dicts' AND column_name = 'typeDictionary'`)
    if (exists.length === 0) {
      await queryInterface.addColumn('dicts', 'typeDictionary', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      });
    } else {
      console.log('dicts.typeDictionary up to date')
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('dicts', 'typeDictionary');
  }
};
