/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { returnError } from '../utils/error';
import { QueryTypes } from 'sequelize';
import sequelize from '../db/config';

class StatsController {

    async getBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                // questions - Общее количество вопросов в анкете
                const qCount = await sequelize.query<any>(`SELECT COUNT(*) as count FROM survey_questions WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const questions = qCount.length ? +qCount[0].count : 0;

                // answers - Количество вопросов, на которые был дан ответ
                // const aCount = await sequelize.query<any>(`SELECT json_array_length(answers) as count FROM survey_lists WHERE "surveyId" = :id`, {
                //     replacements: { id: id },
                //     type: QueryTypes.SELECT
                // });
                // const answers = aCount.length ? +aCount[0].count : 0;

                // openCount - Количество пользователей, которые открыли анкету
                const oCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const open = oCount.length ? +oCount[0].count : 0;

                // openAndAnswerCount - Количество пользователей, которые открыли анкету и ответили хотя бы на один вопрос анкеты
                const oaCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null AND json_array_length(answers) > 0`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const openAndAnswer = oaCount.length ? +oaCount[0].count : 0;

                // openAndUnanswer - Количество пользователей, которые открыли анкету и не ответили ни на один вопрос
                const ouaCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null AND json_array_length(answers) = 0`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });
                const openAndUnanswer = ouaCount.length ? +ouaCount[0].count : 0;

                // openAndAllAnswersCount - Количество пользователей, которые открыли анкету и ответили на все вопросы анкеты
                const oAllA = await sequelize.query<any>(`SELECT answers FROM survey_lists WHERE "surveyId" = :id AND "tsStart" IS NOT null`, {
                    replacements: { id: id, questions: questions },
                    type: QueryTypes.SELECT
                });
                

                let tempCount = 0;
                let fillCount = 0;

                for ( const item of oAllA ) {
                    for ( const a of item.answers ) {
                        if ( a.answer ) {
                            tempCount++;
                        }
                    }
                    if ( fillCount == questions ) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        tempCount = 0;
                        fillCount++;
                    }
                }

                const openAndAllAnswers = fillCount;

                // finishCount - Количество пользователей, которые завершили анкету
                // const fCount = await sequelize.query<any>(`SELECT COUNT("userId") as count FROM survey_lists WHERE "surveyId" = :id AND "tsEnd" IS NOT null`, {
                //     replacements: { id: id },
                //     type: QueryTypes.SELECT
                // });
                // const finish = fCount.length ? +fCount[0].count : 0;

                const time = await sequelize.query<any>(`SELECT ("tsEnd" - "tsStart") as time FROM survey_lists WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const finishTime = time.length ? time[0].time : {};

                //#region Get Charts Data
                async function getChart1() {
                    const answers = await sequelize.query<any>(`SELECT answers FROM survey_lists WHERE "surveyId" = :id`, {
                        replacements: { id: id },
                        type: QueryTypes.SELECT
                    });

                    let fillCount = 0;

                    for ( const item of answers ) {
                        for ( const a of item.answers ) {
                            if ( a.answer ) {
                                fillCount++;
                            }
                        }
                    }

                    const complete = ( fillCount / questions ) * 100;

                    return Math.round( complete );
                }

                async function getChart2() {
                    return Math.round( (openAndAnswer / open ) * 100 );
                }

                async function getChart3() {
                    return Math.round( ( openAndUnanswer / open ) * 100 );
                }

                async function getChart4() {
                    return Math.round( ( openAndAllAnswers / open ) * 100 );
                }

                async function getChart5() {
                    const answers = await sequelize.query<any>(`SELECT answers FROM survey_lists WHERE "surveyId" = :id`, {
                        replacements: { id: id },
                        type: QueryTypes.SELECT
                    });

                    let fillCount = 0;

                    for ( const item of answers ) {
                        for ( const a of item.answers ) {
                            if ( a.answer ) {
                                fillCount++;
                            }
                        }
                    }

                    const complete = ( fillCount / questions ) * 100;

                    return Math.round( 100 - complete );
                }
                //#endregion

                res.status(200).json({
                    chart1: await getChart1(),
                    chart2: await getChart2(),
                    chart3: await getChart3(),
                    chart4: await getChart4(),
                    chart5: await getChart5(),

                    finishTime: finishTime
                });
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    async getQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                const questions = await sequelize.query<any>(`SELECT * FROM survey_lists as sl JOIN survey_questions as sq ON sl."surveyId" = sq."surveyId" WHERE sl."surveyId" = :id;`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const assoc = new Map();

                for ( const q of questions ) {
                    if ( !assoc.has(q.id) ) {
                        assoc.set( q.id, new Map() );
                    }

                    for ( const a of q.answers ) {
                        if ( assoc.has(a.id) ) {
                            const map = assoc.get(a.id);
                            
                            if ( !map.has(a.answer) ) {
                                map.set(a.answer, 1);
                            }
                            else {
                                const count = map.get(a.answer);
                                map.set(a.answer, count + 1);
                            }

                            assoc.set(a.id, map);
                        }
                    }
                }

                const map = new Map();

                for ( const q of questions ) {
                    map.set(q.id, {
                        id: q.id,
                        question: q.question,
                        answers: assoc.has(q.id) ? Object.fromEntries(assoc.get(q.id)) : {}
                    } );
                }

                console.log(map);

                const result = [];

                for ( const item of [...map.values()] ) {
                    const arr = [];

                    for ( const key in item.answers ) {
                        arr.push( {
                            answer: key,
                            count: item.answers[key],
                            total: questions.length
                        } );
                    }

                    arr.sort((a,b) => b.count - a.count );

                    result.push({
                        id: item.id,
                        question: item.question,
                        answers: arr
                    });
                }

                result.sort((a,b) => a.id - b.id );

                res.status(200).json( result );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    async getMissedQuestionsBySurvey(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { id } = req.params;

                // вопросы анкеты
                const questions = await sequelize.query<any>(`SELECT * FROM survey_questions WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const set = new Set();

                for ( const item of questions ) {
                    set.add(item.id);
                }

                console.log( set );

                // вопросы анкеты
                const answers = await sequelize.query<any>(`SELECT * FROM survey_lists WHERE "surveyId" = :id`, {
                    replacements: { id: id },
                    type: QueryTypes.SELECT
                });

                const map = new Map();

                for ( const item of answers ) {
                    if ( item.answers.length < set.size ) {
                        const newSet = new Set();
                        
                        for ( const a of item.answers ) {
                            newSet.add(a.id);
                        }

                        map.set(item.userId, [...set].filter(x => ![...newSet].includes(x)));
                    }
                }

                const newMap = new Map();

                for (const [key, value] of map) {
                    if ( Array.isArray(value) ) {
                        for ( const item of value ) {
                            if ( !newMap.has(item) ) {
                                newMap.set(item, [key]);
                            }
                            else {
                                const arr = newMap.get(item);
                                arr.push(key);
                                newMap.set(item, arr);
                            }
                        }
                    }
                }

                console.log(newMap);

                const result = [];

                for ( const q of questions ) {
                    if ( newMap.has(q.id) ) {
                        const arr = newMap.get(q.id);

                        result.push({
                            id: q.id,
                            question: q.question,
                            type: q.type,
                            count: arr.length,
                            total: answers.length
                        });
                    }
                }

                result.sort((a,b) => b.count - a.count );

                res.status(200).json(result);
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const statsController = new StatsController();
