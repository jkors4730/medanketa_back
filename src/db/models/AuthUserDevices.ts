import sequelize from '../config.js';
import { DataTypes } from 'sequelize';
export type TUserDevices = {
  deviceName: string;
  deviceModel: string;
  loginTime: Date;
};

export const AuthUserDevices = sequelize.define('authUserDevices', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  devices: { type: DataTypes.JSON, allowNull: false },
  // addDevice() {
  //   return this.devices;
  // },
});
