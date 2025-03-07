import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const Spec = sequelize.define(
  'specs',
  {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  }
);
