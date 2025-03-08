export interface RegistrationMessage {
  name: string;
  email: string;
  dateReg: Date;
  platform: string;
}
export interface UserRegistrationMessage extends RegistrationMessage {
  password: string;
}
export interface SupportMessage extends RegistrationMessage {
  lastName: string;
  dateRequest: Date;
  text: string;
}

export interface DeleteMessage extends RegistrationMessage {
  lastName: string;
}
