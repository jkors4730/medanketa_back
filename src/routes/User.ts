import { Router, Request, Response } from 'express';
import { User } from '../db/models/User';
import { Role } from '../db/models/Role';
import { comparePassword, passwordHash } from '../utils/hash';
import { generateAuthToken } from '../utils/jwt';
import { authMiddleware } from '../utils/authMiddleware';

const userRoutes = Router();

userRoutes.get('/protected', authMiddleware, async (req: Request, res: Response) => {
    const tokenData = req.body.tokenData;
    console.log('tokenData', tokenData);

    if ( tokenData ) {
        res.send('Access GRANTED');
    } else {
        res.send('Access DENIED');
    }
} );

// login test
userRoutes.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const exists = await User.findOne({ where: { email: email } }) as any;
    console.log('exists', exists?.toJSON());

    if ( exists ) {
        const validPassword = comparePassword(password, exists.password);

        if ( validPassword ) {
            const token = generateAuthToken(exists);

            res.send({ token });
        } else {
            res.status(404).json({
                error: 'User password is invalid!'
            });
        }
    } else {
        res.status(404).json({
            error: 'User with this email not exists!'
        });
    }
} );

// hash test
// userRoutes.post('/test', async (req: Request, res: Response) => {

//     const { name, email, password } = req.body;

//     const exists = await User.findOne({ where: { email: email } });
//     console.log('exists', exists);

//     if ( !exists ) {
//         const hash = passwordHash(password);
//         // next create user with email and hashed pass
//         const user = {
//             name,
//             email,
//             password,
//             hash
//         };

//         console.log( 'User', user );

//         res.status(201).json(user);
//     } else {
//         res.status(404).json({
//             error: 'User with this email already exists!'
//         });
//     }
// });

// CREATE (C)
userRoutes.post('/', async (req: Request, res: Response) => {

    const { role_name, name, email, password } = req.body;

    const exists = await User.findOne({ where: { email: email } });
    console.log('exists', exists);

    if ( !exists ) {
        const mapping: Record<string, string> = {
            "Интервьюер": "intervuer",
            "Респондент": "respondent" 
        };
    
        // find or create role
        const [role,] = await Role.findOrCreate<any>({
            where: { guard_name: mapping[role_name] },
            defaults: {
                name: role_name,
                guard_name: mapping[role_name],
            },
        });
    
        console.log( 'Role', role.toJSON(), role.id );

        const hash = passwordHash(password);
     
        const user = User.build({
            name: name,
            email: email,
            password: hash, // store hashed password in db
            role_id: role.id // connect with role
        });
    
        console.log( 'User', user.toJSON() );
    
        await user.save();
    
        res.status(201).json(user.toJSON());
    } else {
        res.status(404).json({
            error: 'User with this email already exists!'
        });
    }
});

// GET_ALL (R)
userRoutes.get('/', async (_req: Request, res: Response) => {
    const users = await User.findAll();

    res.json(users);
});

// GET_ONE (R)
userRoutes.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const user = await User.findByPk( parseInt(id) );

    if (user === null) {
        res.status(404).json('{}');
    } else {
        res.status(200).json(user.toJSON());
    }
});

// UPDATE (U)
userRoutes.put('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const { title, email, password } = req.body;

    const user = await User.findByPk<any>( parseInt(id) );

    if (user === null) {
        res.status(404).json('{}');
    } else {
        user.name = title || user.title;
        user.email = email || user.email;
        user.password = password || user.password;

        await user.save();

        res.status(200).json(user.toJSON());
    }
  });

// DELETE (D)
userRoutes.delete('/:id', async (req: Request, res: Response) => {

    const { id } = req.params;

    const user = await User.findByPk( parseInt(id) );

    if (user === null) {
        res.status(404).send();
    } else {
        await user.destroy();
        res.status(204).send();
    }
});

export default userRoutes;