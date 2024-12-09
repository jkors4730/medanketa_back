/* eslint-disable @typescript-eslint/no-explicit-any */
 import { passwordHash } from "../utils/hash";
import { Role } from "./models/Role";
import { Survey } from "./models/Survey";
import { SurveyQuestion } from "./models/SurveyQuestion";
import { User } from "./models/User";

export const applyTestDB = async () => {

    //#region ROLES
    const interviewer = await Role.create<any>({
        guardName: 'interviewer',
        name: 'Интервьюер',
    });

    const respondent = await Role.create<any>({
        guardName: 'respondent',
        name: 'Респондент',
    });
    //#endregion

    //#region USERS
    const pass = passwordHash('1234');

    const user1 = await User.create<any>({
        email: 'int@mail.ru',
        name: 'Eugene',
        lastname: 'Dovgan',
        surname: '',
        password: pass,
        roleId: interviewer.id
    });

    await User.create<any>({
        email: 'resp@mail.ru',
        name: 'Lex',
        lastname: 'Luthor',
        surname: '',
        password: pass,
        roleId: respondent.id
    });
    //#endregion

    //#region SURVEYS
    const common1 = {
        image: 'empty',
        status: true,
        access: true,
        description: 'desc'
    };

    const survey1 = await Survey.create<any>({
        userId: user1.id,
        title: 'Анкета №1',
        slug: 'survey1',
        ...common1
    });

    const survey2 = await Survey.create<any>({
        userId: user1.id,
        title: 'Анкета №2',
        slug: 'survey2',
        ...common1
    });

    const survey3 = await Survey.create<any>({
        userId: user1.id,
        title: 'Анкета №3',
        slug: 'survey3',
        ...common1
    });
    //#endregion

    //#region QUESTIONS
    const bulkCreateQuestion = async (question: string) => {
        const builder = (id: number, q: string) => {
            return {
                surveyId: id,
                question: q,
                type: 'infoblock',
                status: true,
                description: 'Выберите ответ'
            }
        };
        await SurveyQuestion.create( builder(survey1.id, question));
        await SurveyQuestion.create(builder(survey2.id, question));
        await SurveyQuestion.create(builder(survey3.id, question));
    };

    bulkCreateQuestion('Принимаете ли вы лекарства?');
    bulkCreateQuestion('Как часто вы болеете?');
    bulkCreateQuestion('Принимаете ли вы Аспирин?');
    bulkCreateQuestion('У вас бывают головные боли?');
    //#endregion
};