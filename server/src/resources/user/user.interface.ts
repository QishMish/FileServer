export interface IUser {
  email: string;
  username: string;
  password: string;
}

export interface IUserCreate {
  email: string;
  username: string;
  password: string;
}
export interface IUserLogin {
  username: string;
  password: string;
}

export interface IAuthResult {
  token: string;
}
export interface IUserService {
  create(registerBody: IUserCreate): Promise<void | Response | IAuthResult>;
  login(loginBody: IUserLogin): Promise<void | Response | IAuthResult>;
}
