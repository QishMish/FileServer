import { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import request from "supertest";
import app from "../app";

describe("User service", () => {
  it("should return array", async () => {
    await supertest(app).get("/api/v1/user").expect(200);
  });
});
