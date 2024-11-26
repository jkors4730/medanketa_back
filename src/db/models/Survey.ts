import { DataTypes } from "sequelize";
import sequelize from "../config";

export const Survey = sequelize.define(
    'survey',
    {
        userId: { type: DataTypes.INTEGER, allowNull: false, },  // required
        image: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        title: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        slug: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }, // required
        status: { type: DataTypes.BOOLEAN, allowNull: false }, // required

        description: { type: DataTypes.STRING, defaultValue: '', },
        expireDate: DataTypes.DATE,
        
        questions: DataTypes.JSON,
    }
);