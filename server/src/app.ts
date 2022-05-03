import express, { Application, ErrorRequestHandler } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import ErrorMiddleware from "@/middleware/error.middleware";
import Controller from "@/utils/interfaces/controller.interface";
import multer from "@/libs/multer";
import asyncHandler from "express-async-handler";
import db from "@/config/db.config";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import axios from "axios";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
    this.initialiseDatabase();

    // this.getFiles();
  }
  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(
      "/files",
      authenticatedMiddleware,
      express.static("uploads")
    );
    this.express.use(<ErrorRequestHandler>ErrorMiddleware);
  }
  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", asyncHandler(controller.router));
    });
  }
  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }
  private initialiseDatabase(): void {
    console.log(db);
    db.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err: Error) =>
        console.log("Error during Data Source initialization", err)
      );
  }
  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
  private async getFiles() {
    const data = await axios.get(
      "http://localhost:3000/files/image/9307dbe4-4f12-40c2-b21c-ea51043bf921.png",
      {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pc2hvMTIzIiwiaWF0IjoxNjUxNDg3NzIzLCJleHAiOjE2NTIwOTI1MjN9.-hIAqAi91qVSLs2Oj4Ora47bE7OxuD7o66oU12IMO3k",
        },
      }
    );
  }
}

export default App;
