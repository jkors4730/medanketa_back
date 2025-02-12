/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { returnError } from '../utils/error';
import { validationResult } from 'express-validator';
import { mailService } from '../services/Mail';

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
                const { login } = req.body;

                res.status(200).json( login );
            }
            else {
                returnError(null, res, errors.array() );
            }
        }
        catch (e: any) { returnError(e, res); }
    }

}

export const emailController = new EmailController();
