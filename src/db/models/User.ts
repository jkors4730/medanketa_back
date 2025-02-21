import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ modelName: 'user' })
export class UserModel extends Model {
  @Column({ type: DataTypes.INTEGER })
  declare id: number;
  @Column({ type: DataTypes.STRING, allowNull: false, defaultValue: '' })
  name: string;
  @Column({ type: DataTypes.STRING, allowNull: false, defaultValue: '' })
  email: string;
  @Column({ type: DataTypes.STRING, allowNull: false, defaultValue: '' })
  password: string;
  @Column({ type: DataTypes.INTEGER })
  roleId: number;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  lastName: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  surname: string;
  @Column({ type: DataTypes.DATE })
  emailVerifiedAt: Date;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  birthDate: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  phone: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  region: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  city: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  workPlace: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' }) //TODO есть отдельная табла, сделать relations
  specialization: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  position: string;
  @Column({ type: DataTypes.INTEGER })
  workExperience: number;
  @Column({ type: DataTypes.BOOLEAN })
  pdAgreement: boolean;
  @Column({ type: DataTypes.BOOLEAN })
  newsletterAgreement: boolean;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  twoFactorSecret: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  twoFactorRecoveryCodes: string;
  @Column({ type: DataTypes.DATE, defaultValue: '' })
  twoFactorConfirmedAt: Date;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  rememberToken: string;
  @Column({ type: DataTypes.STRING, defaultValue: '' })
  avatar: string;
  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  isBlocked: boolean;
  //@Column({ type: DataTypes.INTEGER, allowNull: false })
  //HasOne()
  // role: RoleModel
}
