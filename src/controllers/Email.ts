/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { returnError } from '../utils/error.js';
import { validationResult } from 'express-validator';
import { User } from '../db/models/User.js';
import { passwordHash } from '../utils/hash.js';
import { MailService, mailService } from '../services/Mail.js';
import { generatePassword } from '../utils/common.js';
import { Service } from 'typedi';
import { SupportMessage } from '../services/interfaces/mail.interface.js';
@Service()
export class EmailController {
  nodeMailer = new MailService();
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

      if (errors.isEmpty()) {
        const { email, message } = req.body;
        const user = await User.findOne({ where: { email: email } });
        const JSONuser = user.toJSON();
        const supportMessage: SupportMessage = {
          email: email,
          name: JSONuser.name,
          text: message,
          platform: 'medanketa.com',
          dateReg: JSONuser.createdAt,
          dateRequest: new Date(),
          lastName: JSONuser.lastName,
        };
        this.nodeMailer.sendAdminSupportMail(supportMessage);
        this.nodeMailer.sendUserSupportMail(email, supportMessage);

        res.status(200).json({
          sucess: true,
        });
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
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

      if (errors.isEmpty()) {
        const { email } = req.body;

        const exists = await User.findOne<any>({ where: { email: email } });
        console.log('exists', exists);

        if (!exists) {
          res.status(404).json({
            success: false,
            error: 'Пользователь не найден',
          });
        } else {
          const newPassword = generatePassword();
          exists.password = passwordHash(newPassword);
          await exists.save();

          mailService.sendPasswordRecovery(email, newPassword);

          res.status(200).json({
            success: true,
          });
        }
      } else {
        returnError(null, res, errors.array());
      }
    } catch (e: any) {
      returnError(e, res);
    }
  }
}

export const emailController = new EmailController();
