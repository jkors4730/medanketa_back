import 'dotenv/config';
import nodemailer from 'nodemailer';
import type {
  DeleteMessage,
  RegistrationMessage,
  SupportMessage,
  UserRegistrationMessage,
} from './interfaces/mail.interface.js';

export class MailService {
  private readonly transporter: nodemailer.Transporter;
  toAdmin = 'info@medanketa.com, medanketa@lancetpharm.ru';
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendAdminProcessingPdMail(message: DeleteMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: this.toAdmin,
      subject: `Пользователь ${message.email} изменил согласие на обработку персональных данных`,
      text: `Уважаемый(ая) Администратор,  

Пользователь ${message.name} ${message.lastName} изменил настройку согласия на обработку персональных данных.  

**Детали события:**  
- Пользователь: ${message.name} ${message.lastName}
- Email: ${message.email} 
- Дата и время: ${new Date()}  
- Новый статус согласия: Согласие отозвано
- IP-адрес: [IP]  //TODO front req.body
- Устройство/браузер: [User-Agent, если доступно]  //TODO front req.body

**Действия:**  
Если согласие отозвано, убедитесь, что обработка ПД пользователя приостановлена (если требуется по политике).  

**Напоминание:**  
- Событие должно быть зафиксировано в журнале согласий (GDPR/ФЗ-152 и аналогичные регуляции).  
- При отзыве согласия может потребоваться удалить данные пользователя (если это предусмотрено правилами).  

С уважением,  
Система уведомлений medanketa.com
`,
    });
  }
  async sendUserProcessingPdMail(to: string, message: DeleteMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Ваше согласие на обработку данных отозвано, аккаунт заблокирован`,
      text: `Здравствуйте, ${message.name}!  

Это письмо подтверждает, что вы отозвали согласие на обработку ваших персональных данных на сервисе medanketa.com.  

**Детали изменения:**  
- Дата и время: ${new Date()} 
- Новый статус:  Согласие отозвано
- IP-адрес: [IP]  //TODO front req.body
- Устройство: [например, "Chrome, Windows"]  //TODO front req.body

**Что это значит?**  
  Мы прекращаем обработку ваших персональных данных, за исключением случаев, предусмотренных законом.  
  Ваш аккаунт был заблокирован.  

**Важные действия:**  
1. Если это изменение совершили не вы, [сообщите нам](mailto:info@medanketa.com).  
2. Прочтите нашу [Политику конфиденциальности](ссылка), чтобы узнать больше.  

С уважением,  
Команда medanketa.com

---  
Это автоматическое уведомление. Пожалуйста, не отвечайте на него.  
`,
    });
  }
  async sendAdminDeleteMail(message: DeleteMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: this.toAdmin,
      subject: `Аккаунт пользователя ${message.email} удален`,
      text: `Уважаемый(ая) Администратор,  

Пользователь ${message.name} ${message.lastName} инициировал удаление своего аккаунта на платформе ${message.platform}.  

**Детали события:**  
- Пользователь: ${message.name} ${message.lastName} 
- Email: ${message.email} 
- Дата и время удаления: ${new Date()}    
- IP-адрес: [IP]  // TODO front req.body
- Устройство: [User-Agent, если доступно] // TODO front req.body 

**Требуемые действия:**  
1. Убедитесь, что все персональные данные пользователя удалены/архивированы в соответствии с [Политикой конфиденциальности](ссылка). ?getLink
2. Внесите запись в журнал аудита: [Ссылка на журнал]  ?getLink

**Важно:**  
- При работе с GDPR/CCPA убедитесь, что данные полностью анонимизированы.  

С уважением,  
Система мониторинга medanketa.com
`,
    });
  }
  async sendUserDeleteMail(to: string, message: DeleteMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Ваш аккаунт на medanketa.com удален`,
      text: `Здравствуйте, ${message.name}!  

Мы подтверждаем, что ваш аккаунт ${message.email} и все связанные данные были удалены.  

**Детали:**  
- Дата удаления: ${new Date()}

**Последствия удаления:**  
Вы больше не сможете войти на платформу.  
Весь контент (файлы, сообщения, настройки) безвозвратно удален.    

**Напоминание:**  
- Данные, которые мы обязаны хранить по закону (например, финансовые транзакции), останутся в анонимизированном виде.  
- Подробности: [Политика конфиденциальности](ссылка). ?getLink 

Спасибо, что были с нами!  
Команда medanketa.com

---  
Это автоматическое уведомление. Пожалуйста, не отвечайте на него.  
`,
    });
  }
  async sendAdminSupportMail(message: SupportMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: this.toAdmin,
      subject: `Новый запрос в поддержку от: ${message.email}`,
      text:
        'Уважаемая команда поддержки,  \n' +
        '\n' +
        'Пользователь отправил новый запрос:  \n' +
        '\n' +
        '**Детали обращения:**  \n' +
        `- Имя пользователя: ${message.name} ${message.lastName}\n  
` +
        `- Email: ${message.email}\n  
` +
        `- Дата и время: ${message.dateRequest}\n  
` +
        '- Сообщение:  \n' +
        `«${message.text}»  
` +
        '\n' +
        'С уважением,  \n' +
        'Система уведомлений medanketa.com \n',
    });
  }
  async sendUserSupportMail(to: string, message: SupportMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Ваш запрос на ресурсе medanketa.com принят\n',
      text:
        `Здравствуйте, ${message.name}!  
` +
        '\n' +
        'Благодарим за обращение в поддержку medanketa.com. Ваш запрос получен и будет рассмотрен в ближайшее время.  \n' +
        '\n' +
        '**Детали запроса:**  \n' +
        '- Сообщение:  \n' +
        `«${message.text}»  
` +
        '\n' +
        'С уважением,  \n' +
        'Команда поддержки medanketa.com\n' +
        '\n' +
        '---  \n' +
        'Это автоматическое уведомление. Пожалуйста, не отвечайте на него.  \n',
    });
  }
  async sendAdminRegistrationMail(message: RegistrationMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: this.toAdmin,
      subject: `Зарегистрирован новый пользователь: ${message.name}`,
      text: `Уважаемый(ая) Администратор,  

На платформе medanketa.com зарегистрирован новый пользователь:  

Данные пользователя:
- Имя пользователя: ${message.name}  
- Email: ${message.email}  
- Дата регистрации: ${message.dateReg}  

С уважением,  
Команда medanketa.com 
`,
    });
  }
  async sendUserRegistrationMail(to: string, message: UserRegistrationMessage) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Добро пожаловать на medanketa.com\n',
      text: `Здравствуйте, ${message.name}!  

Спасибо за регистрацию на medanketa.com!

Ваши данные:
- Email: ${message.email}  
- Пароль: ${message.password} 

С уважением,  
Команда ${message.platform}

---  
Вы получили это письмо, потому что зарегистрировались на medanketa.com.
Это автоматическое уведомление. Пожалуйста, не отвечайте на него.  
`,
    });
  }
  async sendPasswordRecovery(email: string, password: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Меданкета - восстановление пароля`,
      text: '',
      html: `<div>
                <h4>Ваш новый пароль</h4>
                ${password}
            </div>`,
    });
  }
}

export const mailService = new MailService();
