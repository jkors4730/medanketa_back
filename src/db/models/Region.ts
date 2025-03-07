import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const Region = sequelize.define(
  'regions',
  {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  }
);
