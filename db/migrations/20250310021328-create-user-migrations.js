'use strict';

import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      email: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      password: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
      roleId: { type: DataTypes.INTEGER, allowNull: false }, // required

      lastName: { type: DataTypes.STRING, defaultValue: '' },
      surname: { type: DataTypes.STRING, defaultValue: '' },
      emailVerifiedAt: DataTypes.DATE,
      birthDate: { type: DataTypes.STRING, defaultValue: '' },
      phone: { type: DataTypes.STRING, defaultValue: '' },
      region: { type: DataTypes.STRING, defaultValue: '' },
      city: { type: DataTypes.STRING, defaultValue: '' },
      workPlace: { type: DataTypes.STRING, defaultValue: '' },
      specialization: { type: DataTypes.STRING, defaultValue: '' },
      position: { type: DataTypes.STRING, defaultValue: '' },
      workExperience: DataTypes.INTEGER,
      pdAgreement: DataTypes.BOOLEAN,
      newsletterAgreement: DataTypes.BOOLEAN,
      twoFactorSecret: { type: DataTypes.STRING, defaultValue: '' },
      twoFactorRecoveryCodes: { type: DataTypes.STRING, defaultValue: '' },
      twoFactorConfirmedAt: DataTypes.DATE,
      rememberToken: { type: DataTypes.STRING, defaultValue: '' },
      avatar: { type: DataTypes.STRING, defaultValue: '' },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    })
    const [adminRoles] = await queryInterface.sequelize.query(`
    SELECT id FROM roles WHERE "guardName" = 'admin' LIMIT 1;
  `);

    let adminRoleId;

    if (adminRoles.length === 0) {
      // Если роли нет – создаём её с дефолтными правами (например, ['*'] означает все права)
      await queryInterface.bulkInsert('roles', [{
        name: 'Admin',
        guardName: 'admin',
        permissions: ['*'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
      // После вставки заново получаем id созданной роли
      const [newAdminRoles] = await queryInterface.sequelize.query(`
      SELECT id FROM roles WHERE "guardName" = 'admin' LIMIT 1;
    `);
      adminRoleId = newAdminRoles[0].id;
    } else {
      adminRoleId = adminRoles[0].id;
    }

    // Задаем пароль для админа
    const defaultPassword = '72647213'; // Рекомендуется хранить пароль в переменных окружения
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Создаем пользователя с ролью админа
    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRoleId,
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users', {})

  }
};
