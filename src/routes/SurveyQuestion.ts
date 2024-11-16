import { Router, Request, Response } from 'express';
import { SurveyQuestion } from '../db/models/SurveyQuestion';

const surveyQuestionRoutes = Router();

// CREATE (C)
surveyQuestionRoutes.post('/', async (req: Request, res: Response) => {

    const { survey_id, question, type, description, data } = req.body;
     
    const surveyQuestion = SurveyQuestion.build({
        survey_id, question, type, description, data
    });

    console.log( 'SurveyQuestion', surveyQuestion.toJSON() );

    await surveyQuestion.save();

    res.status(201).json(surveyQuestion.toJSON());
});

// GET_ALL (R)
surveyQuestionRoutes.get('/', async (_req: Request, res: Response) => {
    const surveyQuestions = await SurveyQuestion.findAll();

    res.json(surveyQuestions);
});

// GET_ONE (R)
surveyQuestionRoutes.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const surveyQuestion = await SurveyQuestion.findByPk( parseInt(id) );

    if (surveyQuestion === null) {
        res.status(404).json('{}');
    } else {
        res.status(200).json(surveyQuestion.toJSON());
    }
});

// UPDATE (U)
surveyQuestionRoutes.put('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const { survey_id, question, type, description, data } = req.body;

    const surveyQuestion = await SurveyQuestion.findByPk<any>( parseInt(id) );

    if (surveyQuestion === null) {
        res.status(404).json('{}');
    } else {
        surveyQuestion.survey_id = survey_id || surveyQuestion.survey_id;
        surveyQuestion.question = question || surveyQuestion.question;
        surveyQuestion.type = type || surveyQuestion.type;
        surveyQuestion.description = description || surveyQuestion.description;
        surveyQuestion.data = data || surveyQuestion.data;

        await surveyQuestion.save();

        res.status(200).json(surveyQuestion.toJSON());
    }
  });

// DELETE (D)
surveyQuestionRoutes.delete('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const surveyQuestion = await SurveyQuestion.findByPk( parseInt(id) );

    if (surveyQuestion === null) {
        res.status(404).send();
    } else {
        await surveyQuestion.destroy();
        res.status(204).send();
    }
});

export default surveyQuestionRoutes;