import { DataTypes } from 'sequelize';

import { Column, Model, Table } from 'sequelize-typescript';
@Table({ modelName: 'role' })
export class RoleModel extends Model {
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare id: number;
  @Column({ type: DataTypes.STRING, allowNull: false, defaultValue: '' })
  name: string;
  @Column({ type: DataTypes.STRING, allowNull: false, defaultValue: '' })
  guardName: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  rolePriority: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  description: string;
}
// export const Role = sequelize.define('role', {
//   name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
//   guardName: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }, // required
//   rolePriority: { type: DataTypes.STRING, defaultValue: '' },
//   description: { type: DataTypes.STRING, defaultValue: '' },
// });

// enum RoleType {
//   'АДМИН',
//   'ИНТЕРВЬЮЕР',
//   'РЕСПОНДЕНТ',
//   'ГОСТЬ',
// }
