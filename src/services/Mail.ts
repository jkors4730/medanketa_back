import 'dotenv/config';
import nodemailer from 'nodemailer';

class MailService {

    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendSupportMail(to: string, message: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: `Меданкета - поддержка`,
            text: '',
            html: 
            `<div>
                <h4>Запрос в поддержку</h4>
                ${message}
            </div>`
        });
    }

    async sendPasswordRecovery(email: string, password: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: `Меданкета - восстановление пароля`,
            text: '',
            html: 
            `<div>
                <h4>Ваш новый пароль</h4>
                ${password}
            </div>`
        });
    }
}

export const mailService = new MailService();
