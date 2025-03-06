import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

export const Spec = sequelize.define(
  'spec',
  {
    title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
  }
);
