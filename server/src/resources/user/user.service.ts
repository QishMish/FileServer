import {
  IAuthResult,
  IUser,
  IUserCreate,
  IUserLogin,
  IUserService,
} from "./user.interface";
import db from "@/config/db.config";
import User from "@/resources/user/user.model";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import HttpException from "@/utils/exceptions/http.exception";

class UserService implements IUserService {
  private _secret = process.env.JWT_SECRET_KEY || "ab82bc82x2z2oz3ndf";
  private _userRepository = db.getRepository(User);

  //private methods
  private _userExist = async (key: string) => {
    const exist = await this._userRepository.findOneBy({
      username: key,
    });
    return exist;
  };
  private _hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  private _genereteToken = async (payload: object, expirationTime: number) => {
    const token: string = await JWT.sign(payload, this._secret, {
      expiresIn: expirationTime,
    });
    console.log(this._secret);
    return token;
  };

  //public methods
  async create(
    registerBody: IUserCreate
  ): Promise<void | Response | IAuthResult> {
    const { email, password, username } = registerBody;

    if (await this._userExist(username)) {
      throw new HttpException(400, "Username already used");
    } else {
      //hash password
      const hashedPassword = await this._hashPassword(password);

      //generate token
      const token = await this._genereteToken({ username }, 60 * 60 * 24 * 7);

      //insert usert
      await User.insert({
        email,
        username,
        password: hashedPassword,
      });

      return { token };
    }
  }
  async login(loginData: IUserLogin): Promise<void | Response | IAuthResult> {
    const { username, password } = loginData;
    const user = await this._userExist(username);

    if (!user) {
      throw new HttpException(400, "Wrong Credentials");
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      throw new HttpException(400, "Wrong Credentials");
    }

    //generate token
    const token = await this._genereteToken({ username }, 60 * 60 * 24 * 7);
    console.log(token);
    return { token };
  }
  public async getAll(): Promise<IUser[]> {
    const user: IUser[] = await User.find({
      select: ["email", "username"],
    });
    return user;
  }
}

export default UserService;
