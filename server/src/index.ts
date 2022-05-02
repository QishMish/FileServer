import "dotenv/config";
import "module-alias/register";
import App from "./app";
import FileController from "@/resources/file/file.controller";
import validateEnv from "./utils/validateEnv";
import UserController from "./resources/user/user.controller";

validateEnv();
const app = new App(
  [new FileController(), new UserController()],
  Number(process.env.PORT)
);

app.listen();
