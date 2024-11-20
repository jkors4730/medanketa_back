import { DataTypes } from "sequelize";
import sequelize from "../config";

export const SurveyQuestion = sequelize.define(
    'survey_question',
    {
        surveyId: { type: DataTypes.INTEGER, allowNull: false },  // required
        question: { type: DataTypes.STRING, allowNull: false },   // required
        type: { type: DataTypes.STRING, allowNull: false },       // required
        status: { type: DataTypes.BOOLEAN, allowNull: false },    // required
        
        description: DataTypes.STRING,
        data: DataTypes.STRING,
    }
);