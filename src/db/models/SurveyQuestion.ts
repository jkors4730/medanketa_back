import { DataTypes } from "sequelize";
import sequelize from "../config";

export const SurveyQuestion = sequelize.define(
    'surveyQuestion',
    {
        surveyId: { type: DataTypes.INTEGER, allowNull: false },  // required
        question: { type: DataTypes.STRING, allowNull: false },  // required
        type: { type: DataTypes.STRING, allowNull: false },  // required
        
        description: DataTypes.STRING,
        data: DataTypes.STRING,
    }
);