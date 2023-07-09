export interface LoginCred{
    email: string;
    password: string;
    notification_id: string;
}

export interface User {
  fullname: string;
  email: string;
  phone?: string;
  token: string;
  token_type: string;
  expiry: string;
  roles: string;
  new_user: string;
  verified_otp: boolean;
  verified_kyc: boolean;
  has_pin: boolean;
  message?: string;
}

export interface UserProfile{
}

export class RegisterCred{

  email: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  username: string;
  date_of_birth: string;
  phone: string;
  country: string;
  password: string;
  password_confirmation: string;
  notification_id: string;
  remember_me: boolean;

  constructor(){
    this.email = ''; this.firstname = ''; this.lastname = ''; this.middlename = ''; this.username = ''; this.date_of_birth = '';
    this.phone = ''; this.password = ''; this.country = '';  this.password_confirmation = ''; this.notification_id = '';
    this.remember_me = false;
  }
}

export class NextOfKin{
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  relationship?: string;

  constructor(){
    this.email = ''; this.firstname = ''; this.lastname = ''; this.phone = ''; this.relationship = '';
  }
}

// export interface RegisterCred{
//   code?: number | string;
//   email: string;
//   fullname: string;
//   phone: string;
//   roles: string;
//   token: string;
//   password: string;
//   password_confirmation: string;
//   notification_id: string;
// }
