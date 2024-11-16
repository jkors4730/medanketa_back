import { Role } from "./models/Role";
import { User } from "./models/User";
import { Survey } from "./models/Survey";
import { SurveyQuestion } from "./models/SurveyQuestion";

const isDev = process.env.NODE_ENV === 'dev';

export const dbSyncAll = async () => {
    await User.sync({ alter: isDev });
    await Role.sync({ alter: isDev });
    await Survey.sync({ alter: isDev });
    await SurveyQuestion.sync({ alter: isDev });
};

export const dbDropAll = async () => {
    await User.drop();
    await Role.drop();
    await Survey.drop();
    await SurveyQuestion.drop();
};