/* eslint-disable @typescript-eslint/no-explicit-any */
import { SurveyAnswer } from "../db/models/SurveyAnswer";
import { SurveyData } from "../db/models/SurveyData";

interface Answer {
    id?: number;
    answer?: string;
}

export const saveSurveyData = async ( data: string, qid: number ) => {
    try {
        if ( data ) {
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
            // infoblock
            await SurveyData.create({
                sq_id: qid
            });
        }
    }
    catch (e: any) { console.error(e); }
};

export const saveSurveyAnswers = async ( sl_id: number, answers: Answer[] ) => {
    try {
        if ( Array.isArray(answers) ) {
            for ( const item of answers ) {
                await SurveyAnswer.create( {
                    sl_id,
                    sq_id: item.id,
                    answer: item.answer,
                } );
            }
        }
    }
    catch (e: any) { console.error(e); }
};