import { Router, Request, Response } from 'express';
import { Survey } from '../db/models/Survey';

const surveyRoutes = Router();

// CREATE (C)
surveyRoutes.post('/', async (req: Request, res: Response) => {

    const { user_id, image, title, slug, status, description, expire_date } = req.body;
     
    const survey = Survey.build({
        user_id, image, title, slug, status, description, expire_date
    });

    console.log( 'Survey', survey.toJSON() );

    await survey.save();

    res.status(201).json(survey.toJSON());
});

// GET_ALL (R)
surveyRoutes.get('/', async (_req: Request, res: Response) => {
    const surveys = await Survey.findAll();

    res.json(surveys);
});

// GET_ONE (R)
surveyRoutes.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const survey = await Survey.findByPk( parseInt(id) );

    if (survey === null) {
        res.status(404).json('{}');
    } else {
        res.status(200).json(survey.toJSON());
    }
});

// UPDATE (U)
surveyRoutes.put('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const { user_id, image, title, slug, status, description, expire_date } = req.body;

    const survey = await Survey.findByPk<any>( parseInt(id) );

    if (survey === null) {
        res.status(404).json('{}');
    } else {
        survey.user_id = user_id || survey.user_id;
        survey.image = image || survey.image;
        survey.title = title || survey.title;
        survey.slug = slug || survey.slug;
        survey.status = status || survey.status;
        survey.description = description || survey.description;
        survey.expire_date = expire_date || survey.expire_date;

        await survey.save();

        res.status(200).json(survey.toJSON());
    }
  });

// DELETE (D)
surveyRoutes.delete('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const survey = await Survey.findByPk( parseInt(id) );

    if (survey === null) {
        res.status(404).send();
    } else {
        await survey.destroy();
        res.status(204).send();
    }
});

export default surveyRoutes;