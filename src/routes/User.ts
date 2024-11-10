import { Router, Request, Response } from 'express';
import { User } from '../db/models/User';
import { Role } from '../db/models/Role';

const userRoutes = Router();

// CREATE (C)
userRoutes.post('/', async (req: Request, res: Response) => {

    const mapping: Record<string, string> = {
        "Интервьюер": "intervuer",
        "Респондент": "respondent" 
    };

    const roleTitle = req.body.role_name;
    const roleSlug = mapping[roleTitle];

    // find or create role
    const [role,] = await Role.findOrCreate<any>({
        where: { guard_name: roleSlug },
        defaults: {
            name: roleTitle,
            guard_name: roleSlug,
        },
    });

    console.log( 'Role', role.toJSON(), role.id );
 
    const user = User.build({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role_id: role.id // connect with role
    });

    console.log( 'User', user.toJSON() );

    await user.save();

    res.status(201).json(user.toJSON());
});

// GET_ALL (R)
userRoutes.get('/', async (_req: Request, res: Response) => {
    const users = await User.findAll();

    res.json(users);
});

// GET_ONE (R)
userRoutes.get('/:id', async (req: Request, res: Response) => {

    const user = await User.findByPk( parseInt(req.params.id) );

    if (user === null) {
        res.status(404).json('{}');
    } else {
        res.status(200).json(user.toJSON());
    }
});

// UPDATE (U)
userRoutes.put('/:id', async (req: Request, res: Response) => {

    const user = await User.findByPk<any>( parseInt(req.params.id) );

    if (user === null) {
        res.status(404).json('{}');
    } else {
        user.name = req.body.title || user.title;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        await user.save();

        res.status(200).json(user.toJSON());
    }
  });

// DELETE (D)
userRoutes.delete('/:id', async (req: Request, res: Response) => {

    const user = await User.findByPk( parseInt(req.params.id) );

    if (user === null) {
        res.status(404).send();
    } else {
        await user.destroy();
        res.status(204).send();
    }
});

export default userRoutes;