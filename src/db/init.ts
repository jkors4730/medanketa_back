import { Role } from "./models/Role";
import { User } from "./models/User";
import { Survey } from "./models/Survey";
import { SurveyQuestion } from "./models/SurveyQuestion";
import { SurveyList } from "./models/SurveyList";
import { applyTestDB } from "./mock";

export const dbSyncAll = async () => {
    await User.sync({ alter: true });
    await Role.sync({ alter: true });
    await Survey.sync({ alter: true });
    await SurveyQuestion.sync({ alter: true });
    await SurveyList.sync({ alter: true });
};

export const dbDropAll = async () => {
    await User.drop();
    await Role.drop();
    await Survey.drop();
    await SurveyQuestion.drop();
    await SurveyList.drop();
};

export const dbTestAll = async () => {
    await dbDropAll();
    await dbSyncAll();

    await applyTestDB();
};