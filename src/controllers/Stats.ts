/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config';
import { returnFromArr, returnNumFromArr } from '../utils/common';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { Survey } from '../db/models/Survey';

//#region Interfaces
interface StatsQuestion {
    id?: number;
    question?: string;
    type?: string;
    surveyId?: number;
    data?: string;
}

interface StatsAnswer {
    id?: number;
    sq_id?: number;
    user_id?: string;
    answer?: string;
    count?: number;
}

interface StatsDMapped {
    id?: number;
    value?: string; 
    sortId?: number; 
}

interface StatsAMapped {
    id?: number;
    answer?: string; 
    count?: number; 
}

interface StatsQAMapped {
    id?: number;
    question?: string;
    type?: string;
    data: StatsDMapped[],
    answers: Map<string, StatsAMapped>;
}

interface Time {
    seconds?: number;
    minutes?: number;
    hours?: number;
}
//#endregion

//#region Functions
async function getChart1(id: any) {
    return returnNumFromArr(
        await sequelize.query<any>(`--sql
            SELECT DISTINCT
                ROUND( AVG( (
                    ( SELECT COUNT(sl_id)::float
                    FROM survey_answers
                    WHERE "isSkip" = false
                        AND "userId" = sl."userId"
                        AND "surveyId" = :id ) /
                    (
                        ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
                        ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers WHERE "isSkip" = false
                            AND "userId" = sl."userId"
                            AND "surveyId" = :id)
                        )::float) * 100)::numeric, 2) as complete
            FROM survey_answers sa
                    JOIN survey_lists sl
                        ON sa.sl_id = sl.id
                    LEFT JOIN users u
                            ON sl."userId" = u.id
            WHERE sl."surveyId" = :id`,
            {
                replacements: { id: id },
                type: QueryTypes.SELECT
            }),
            'complete'
        );
}

async function getChart2(id: any) {
    return returnNumFromArr(
        await sequelize.query<any>(`--sql
            -- кол-во уникальных юзеров, которые ответили на вопросы
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_answers
            WHERE "isSkip" = false
                AND "surveyId" = :id )::float
            /
            -- кол-во уникальных юзеров, которые открыли анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
            AND "surveyId" = :id )::float * 100)::numeric, 2) as response_rate`,
            {
                replacements: { id: id },
                type: QueryTypes.SELECT
            }),
            'response_rate'
        );
}

async function getChart3(id: any) {
    return returnNumFromArr(
        await sequelize.query<any>(`--sql
            -- кол-во уникальных юзеров, которые открыли анкету,
            -- но не ответили ни на один вопрос
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
            AND "tsEnd" IS NULL
            AND json_array_length(answers) = 0
            AND "surveyId" = :id )::float
            /
            -- кол-во уникальных юзеров, которые открыли анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsStart" IS NOT NULL
                AND "surveyId" = :id )::float * 100)::numeric, 2) as cancel_rate`,
            {
                replacements: { id: id },
                type: QueryTypes.SELECT
            }),
            'cancel_rate'
        );
}

async function getChart4(id: any) {
    return returnNumFromArr(
        await sequelize.query<any>(`--sql
            -- кол-во уникальных юзеров, которые ответили на все вопросы
            SELECT ROUND( ( ( SELECT COUNT(DISTINCT "userId")
            FROM survey_answers
            WHERE "isSkip" = false
                AND "surveyId" = :id
            GROUP BY "userId"
            HAVING COUNT(*) = (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id) LIMIT 1 )::float
                /
            -- кол-во уникальных юзеров, которые завершили анкету
            ( SELECT COUNT(DISTINCT "userId")
            FROM survey_lists
            WHERE "tsEnd" IS NOT NULL
                AND "surveyId" = :id )::float * 100)::numeric, 2) as all_answers`,
            {
                replacements: { id: id },
                type: QueryTypes.SELECT
            }),
            'all_answers'
        );
}

async function getChart5(id: any) {
    return returnNumFromArr(
        await sequelize.query<any>(`--sql
            SELECT DISTINCT
            100 - ROUND( AVG( (
            ( SELECT COUNT(sl_id)::float
                FROM survey_answers
                WHERE "isSkip" = false
                AND "userId" = sl."userId"
                AND "surveyId" = :id ) /
            (
            ( SELECT COUNT(*)::float FROM survey_questions WHERE "surveyId" = :id) *
            ( SELECT COUNT(DISTINCT sl_id)::float FROM survey_answers WHERE "isSkip" = false
                AND "userId" = sl."userId"
                AND "surveyId" = :id)
            )::float) * 100)::numeric, 2) as missed_rate
            FROM survey_answers sa
                    JOIN survey_lists sl
                        ON sa.sl_id = sl.id
                    LEFT JOIN users u
                            ON sl."userId" = u.id
            WHERE sl."surveyId" = :id`,
            {
                replacements: { id: id },
                type: QueryTypes.SELECT
            }),
            'missed_rate'
        );
}

async function getFinishTime(id: any) {
    return returnFromArr( await sequelize.query<any>(`--sql
        SELECT AVG("tsEnd" - "tsStart") as finish_time
        FROM survey_lists
        WHERE "surveyId" = :id`,
        {
            replacements: { id: id },
            type: QueryTypes.SELECT
        }),
        'finish_time'
    );
}

function getTime(time: Time):string {
    let str = '';

    if (time.seconds) {
        if (time.seconds) {
            str = `${time.seconds} сек`;
        }
        if (time.minutes) {
            str = `${time.minutes} мин ${str}`;
        }
        if (time.hours) {
            str = `${time.hours} час ${str}`;
        }
    } else {
        str = 'мало данных';
    }

    return str;
};
//#endregion
class StatsController {

    /**
     * Получить статистику для чартов
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                res.status(200).json({
                    chart1: await getChart1(id),
                    chart2: await getChart2(id),
                    chart3: await getChart3(id),
                    chart4: await getChart4(id),
                    chart5: await getChart5(id),

                    finishTime: await getFinishTime(id)
                });
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить статистику по пропущенным вопросам 
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getMissedQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const arr = await sequelize.query<any>(`--sql
                    SELECT DISTINCT sq.id,
                    sq.question,
                    ROUND( ( ( COUNT(sa."userId")::float /
                    (SELECT COUNT(*) FROM survey_questions WHERE "surveyId" = :id)::float ) * 100)::numeric, 2 )::float as missed_rate
                FROM survey_answers sa
                JOIN survey_questions sq
                ON sa.sq_id = sq.id
                WHERE
                    sa."isSkip" = true
                    AND sa."surveyId" = :id
                    GROUP BY sq.id
                    ORDER BY missed_rate DESC`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                res.status(200).json(arr);
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить статистику ответов на вопросы 
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                // получаем вопросы
                const questions = await sequelize.query<StatsQuestion>(`--sql
                SELECT id,
                    question,
                    type,
                    "surveyId",
                    data
                FROM survey_questions
                WHERE "surveyId" = :id`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                // получаем ответы
                const answers = await sequelize.query<StatsAnswer>(`--sql
                SELECT id,
                    sq_id,
                    "userId",
                    answer,
                    (SELECT COUNT(*) as count
                    FROM survey_answers
                    WHERE sq_id = sa.sq_id
                        AND answer = sa.answer
                        AND "userId" = sa."userId"
                        AND "surveyId" = :id)::numeric
                FROM survey_answers sa
                WHERE "surveyId" = :id`,
                {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const mappedQS = new Map<number, StatsQAMapped>();

                for ( const q of questions ) {
                    const qData = [] as StatsDMapped[];
                    // парсим варианты ответов из вопроса
                    if ( q.data ) {
                        const data = JSON.parse(q.data);

                        if ( data.answers && Array.isArray(data.answers) ) {
                            for ( const item of data.answers ) {
                                qData.push( {...item, id: q.id } as StatsDMapped );
                            }
                        }
                    }
                    // мапим вопросы по id (для дальнейшей работы с ответами)
                    mappedQS.set(Number(q.id), {
                        id: q.id,
                        question: q.question,
                        type: q.type,
                        data: qData,
                        answers: new Map<string, StatsAMapped>(),
                    } as StatsQAMapped);
                }

                for ( const a of answers ) {
                    const base = mappedQS.get(Number(a.sq_id));

                    // проверяем наличие вопрос в мапе
                    if ( base ) {
                        const key = a.answer || '';
                        // проверяем наличие ответа в мапе
                        const baseA = base.answers.has(key) ? base.answers.get(key) : null;

                        base.answers.set(key, {
                            id: a.sq_id,
                            answer: a.answer,
                            // счётчик либо суммируется, либо ставится в первый раз 
                            count: baseA ? Number(baseA.count) + Number(a.count) : Number(a.count),
                        } as StatsAMapped);

                        mappedQS.set(Number(a.sq_id), base);
                    }
                }

                // перегоняем мапы в сериализуемый массив для отправки через res.json()
                const resArr = [];
                const arr = Array.from(mappedQS.values());

                for ( const item of arr ) {
                    resArr.push({
                        ...item,
                        answers: Array.from(item.answers.values())
                    });
                }

                res.status(200).json( resArr );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Получить статистику в CSV
     * 
     * @param {number} id surveyId
     * @throws {Error} e
    */
    async getCsvBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;
                const { win } = req.query;

                const survey = await Survey.findByPk<any>(id);

                if ( survey ) {
                    const filesDir = path.join(__dirname, '../assets/files');
                    const filePath = `${filesDir}/${Date.now()}.csv`;
                    fs.mkdirSync(filesDir, { recursive: true });

                    const stats = {
                        chart1: await getChart1(id),
                        chart2: await getChart2(id),
                        chart3: await getChart3(id),
                        chart4: await getChart4(id),
                        chart5: await getChart5(id),
    
                        finishTime: await getFinishTime(id)
                    };

                    const fileContent = 
`Статистика анкеты ${survey.title}
/questionary/${survey.id}
Средний процент завершения анкеты;${stats.chart1}%
Средний процент откликов;${stats.chart2}%
Средний процент отказов;${stats.chart3}%
Средний процент успешного завершения анкет;${stats.chart4}%
Среднее время прохождения анкет;${getTime(stats.finishTime)}
Средний процент пропущенных вопросов;${stats.chart5}%`;

                    const isWin = win === 'true';

                    fs.writeFileSync(filePath, iconv.encode(fileContent, isWin ? 'win1251' : 'utf8'));

                    res.download(filePath);
                }
                else {
                    returnError(null, res, [`Survey with id = ${id} not found`] );
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const statsController = new StatsController();
