import { Router, Request, Response } from 'express';
import { User } from '../db/models/User';
import { Role } from '../db/models/Role';

const roleRoutes = Router();

// CREATE
roleRoutes.post('/', async (req: Request, res: Response) => {
 
    const { name, guard_name } = req.body;

    const role = Role.build({
        name,
        guard_name
    });

    await role.save();

    res.status(201).json(role.toJSON());
});

// GET_ALL
roleRoutes.get('/', async (_req: Request, res: Response) => {
    const roles = await Role.findAll();

    res.json(roles);
});

// GET_ONE
roleRoutes.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const role = await Role.findByPk( parseInt(id) );

    if (role === null) {
        res.status(404).json('{}');
    } else {
        res.status(200).json(role.toJSON());
    }
});

// UPDATE
roleRoutes.put('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const { name, guard_name } = req.body;

    const user = await User.findByPk<any>( parseInt(id) );

    if (user === null) {
        res.status(404).json('{}');
    } else {
        user.name = name || user.name;
        user.guard_name = guard_name || user.guard_name;

        await user.save();

        res.status(200).json(user.toJSON());
    }
  });

// DELETE
roleRoutes.delete('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const role = await Role.findByPk( parseInt(id) );

    if (role === null) {
        res.status(404).send();
    } else {
        await role.destroy();
        res.status(204).send();
    }
});

export default roleRoutes