/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { User } from '../db/models/User';
import { passwordHash } from '../utils/hash';
import { mailService } from '../services/Mail';
import { generatePassword } from '../utils/common';

class EmailController {

    /**
     * Письмо в поддержку
     * 
     * @route {path} /email/support
     * 
     * @throws {Error} e
    */
    async support(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { email, message } = req.body;

                mailService.sendSupportMail(email, message);

                res.status(200).json( {
                    sucess: true
                } );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

    /**
     * Восстановление пароля
     * 
     * @route {path} /email/password-recovery
     * 
     * @throws {Error} e
    */
    async passwordRecovery(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            
            if ( errors.isEmpty() ) {
                const { email } = req.body;

                const exists = await User.findOne<any>({ where: { email: email } });
                console.log('exists', exists);

                if (!exists) {
                    res.status(404).json({
                        success: false,
                        error: "Пользователь не найден"
                    });
                }
                else {
                    const newPassword = generatePassword();
                    exists.password = passwordHash(newPassword);
                    await exists.save();
                    
                    mailService.sendPasswordRecovery(email, newPassword);

                    res.status(200).json( {
                        success: true
                    } );
                }
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const emailController = new EmailController();
