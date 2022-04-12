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
  message?: string;
}

export interface UserProfile{
}

export interface RegisterCred{
  email: string;
  name: string;
  phone: string;
  gender: string;
  password: string;
  password_confirmation: string;
  notification_id: string;
}
