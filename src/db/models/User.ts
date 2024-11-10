import { DataTypes } from "sequelize";
import sequelize from "../config";

export const User = sequelize.define(
    'user',
    {
        name: { type: DataTypes.STRING, allowNull: false },  // required
        email: { type: DataTypes.STRING, allowNull: false }, // required
        password: { type: DataTypes.STRING, allowNull: false }, // required
        role_id: { type: DataTypes.INTEGER, allowNull: false }, // required
        email_verified_at: DataTypes.DATE,
        birth_date: DataTypes.DATE,
        phone: DataTypes.STRING,
        region: DataTypes.STRING,
        city: DataTypes.STRING,
        workplace: DataTypes.STRING,
        specialization: DataTypes.STRING,
        position: DataTypes.STRING,
        work_experience: DataTypes.INTEGER,
        pd_agreement: DataTypes.BOOLEAN,
        newsletter_agreement: DataTypes.BOOLEAN,
        two_factor_secret: DataTypes.STRING,
        two_factor_recovery_codes: DataTypes.STRING,
        two_factor_confirmed_at: DataTypes.DATE,
        remember_token: DataTypes.STRING,
        avatar: DataTypes.STRING,
    }
);