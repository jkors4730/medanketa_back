'use strict';

import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {
    const [exists] = await queryInterface.sequelize.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'surveys' AND column_name = 'isDraft'`,)
    if (exists.length === 0) {
      await queryInterface.addColumn("surveys", "isDraft", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    } else {
      console.log(`column "surveys."isDraft"" already migrate`);
    }

  },

  async down (queryInterface) {
    await queryInterface.removeColumn("surveys", "isDraft");
  }
}
