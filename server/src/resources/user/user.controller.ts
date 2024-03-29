import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import multer from "multer";
import asyncHandler from "express-async-handler";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import authValidation from "@/utils/validations/auth.validation";
import authBodyValidationMiddleware from "@/middleware/authBody.validation.middleware";
import UserService from "@/resources/user/user.service";

class UserController implements Controller {
  public path = "/user";
  public router = Router();
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      authValidation.validateRegisterBody(),
      authBodyValidationMiddleware,
      asyncHandler(this.create)
    );
    this.router.post(
      `${this.path}/login`,
      authValidation.validateLoginBody(),
      authBodyValidationMiddleware,
      asyncHandler(this.login)
    );
  }
  private create = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    let token = await this.userService.create({ email, username, password });
    res.json(token);
  };
  private login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const token = await this.userService.login({ username, password });
    res.json(token);
  };
}

export default UserController;
