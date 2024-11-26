import { DataTypes } from "sequelize";
import sequelize from "../config";

export const User = sequelize.define(
    'user',
    {
        name: { type: DataTypes.STRING, allowNull: false, defaultValue: '', },  // required
        email: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        password: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        roleId: { type: DataTypes.INTEGER, allowNull: false }, // required
        
        emailVerifiedAt: DataTypes.DATE,
        birthDate: DataTypes.DATE,
        phone: { type: DataTypes.STRING, defaultValue: '', },
        region: { type: DataTypes.STRING, defaultValue: '', },
        city: { type: DataTypes.STRING, defaultValue: '', },
        workplace: { type: DataTypes.STRING, defaultValue: '', },
        specialization: { type: DataTypes.STRING, defaultValue: '', },
        position: { type: DataTypes.STRING, defaultValue: '', },
        workExperience: DataTypes.INTEGER,
        pdAgreement: DataTypes.BOOLEAN,
        newsletterAgreement: DataTypes.BOOLEAN,
        twoFactorSecret: { type: DataTypes.STRING, defaultValue: '', },
        twoFactorRecoveryCodes: { type: DataTypes.STRING, defaultValue: '', },
        twoFactorConfirmedAt: DataTypes.DATE,
        rememberToken: { type: DataTypes.STRING, defaultValue: '', },
        avatar: { type: DataTypes.STRING, defaultValue: '', },
    }
);