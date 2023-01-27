import { Application } from "express";
import { Container } from "inversify";
import { configServer } from "../../../src/server/server";


describe('Document controller test', () => {
  let server: {
    app: Application;
    container: Container;
  };

  beforeAll(async () => {
    server = await configServer(true);
  })

  test.skip('/assign-responsible should assign a LSS as responible if requested by a LSE', async () => { /** tbi */})
  test.skip('/assign-responsible should return 400 if the request does not contain a documentId', async () => { /** tbi */})
  test.skip('/assign-responsible should return 400 if the request does not contain a userId', async () => { /** tbi */})
  test.skip('/assign-responsible should return 400 if a document is not found', async () => { /** tbi */})
  test.skip('/assign-responsible should return 400 if a user is not found', async () => { /** tbi */})
  test.skip('/assign-responsible should return 403 if the user making the request doesnt have a LSE role', async () => { /** tbi */})
  test.skip('/assign-responsible should return 400 if the user being assigned doesnt have a LSS role', async () => { /** tbi */})
})