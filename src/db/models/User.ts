import { DataTypes } from "sequelize";
import sequelize from "../config";

export const User = sequelize.define(
    'user',
    {
        name: { type: DataTypes.STRING, allowNull: false },  // required
        email: { type: DataTypes.STRING, allowNull: false }, // required
        password: { type: DataTypes.STRING, allowNull: false }, // required
        roleId: { type: DataTypes.INTEGER, allowNull: false }, // required
        
        emailVerifiedAt: DataTypes.DATE,
        birthDate: DataTypes.DATE,
        phone: DataTypes.STRING,
        region: DataTypes.STRING,
        city: DataTypes.STRING,
        workplace: DataTypes.STRING,
        specialization: DataTypes.STRING,
        position: DataTypes.STRING,
        workExperience: DataTypes.INTEGER,
        pdAgreement: DataTypes.BOOLEAN,
        newsletterAgreement: DataTypes.BOOLEAN,
        twoFactorSecret: DataTypes.STRING,
        twoFactorRecoveryCodes: DataTypes.STRING,
        twoFactorConfirmedAt: DataTypes.DATE,
        rememberToken: DataTypes.STRING,
        avatar: DataTypes.STRING,
    }
);