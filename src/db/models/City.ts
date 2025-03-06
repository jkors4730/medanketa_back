import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const City = sequelize.define(
  'city',
  {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  }
);
