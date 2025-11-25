export interface UsuarioModel {
  userId?:            number;
  name:              string;
  email:             string;
  password?:          string;
  phoneNumber:       string;
  location:          string;
  preferredLanguage: string;
  status:            boolean;
  createdAt?: Date;
  lastLogin?: Date;
  rolId:             number;
  imageUrl?:          string;
  providerId?:        number;
}

export interface UsuarioStringModel {
  userId?:            number;
  name:              string;
  email:             string;
  password?:          string;
  phoneNumber:       string;
  location:          string;
  preferredLanguage: string;
  status:            boolean;
  createdAt?: Date;
  lastLogin?: Date;
  createdAtstring?: string;
  lastLoginstring?: string;
  rolId:             number;
  rolIdString:       string;
  providerId?:        number;
}

export interface LoginModel {
    email: string;
    password: string;
}

export interface PasswordModel {
  passwordAntigua: string;
  passwordNueva: string;
}

export interface UsuarioPuntosModel {
  userPointsId: number;
  points:      number;
  description: string;
}