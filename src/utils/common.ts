/* eslint-disable @typescript-eslint/no-explicit-any */
import { SurveyAnswer } from "../db/models/SurveyAnswer";
import { SurveyData } from "../db/models/SurveyData";

interface Answer {
    id?: number;
    answer?: string;
    isSkip?: boolean;
}

export const saveSurveyData = async ( data: string, qid: number ) => {
    try {
        if ( data && typeof data === 'string' ) {
            const parsed = JSON.parse( data );
            
            for ( const item of parsed.answers ) {
                await SurveyData.create({
                    sq_id: qid,
                    uid: item.id,
                    sortId: item.sortId,
                    value: item.value,
                });
            }
        }
        else {
            // type: infoblock
            await SurveyData.create({
                sq_id: qid
            });
        }
    }
    catch (e: any) { console.error(e); }
};

export const saveSurveyAnswers = async ( surveyId: number, userId: number, sl_id: number, answers: Answer[] ) => {
    try {
        if ( Array.isArray(answers) ) {
            for ( const item of answers ) {
                console.log('[answer_item]', item);

                let answer = String(item.answer);

                if ( typeof item.answer === 'object' ) {
                    answer = '';
                }

                await SurveyAnswer.create( {
                    surveyId,
                    userId,
                    sl_id,
                    sq_id: item.id,
                    answer: answer,
                    isSkip: item.isSkip
                } );
            }
        }
    }
    catch (e: any) { console.error(e); }
};

export const returnFromArr = (arr: any, key: string) => {
    try {
        return Array.isArray(arr) && arr.length
            ?
                arr[0]?.[key]
                ? arr[0]?.[key]
                : null
            : null;
        }
    catch (e: any) { console.error(e); }
};

export const returnNumFromArr = (arr: any, key: string) => {
    try {
        return Number(returnFromArr(arr, key));
    }
    catch (e: any) { console.error(e); }
};