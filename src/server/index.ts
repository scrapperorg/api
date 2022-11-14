import 'module-alias/register';
import { Application } from 'express';
import * as dotenv from 'dotenv';
import { configServer } from './server';

dotenv.config();

function listenApp(app: Application) {
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`anap screening server started at http://localhost:${port}`);
  });
}

(async function startServer() {
  const { app } = await configServer();
  listenApp(app);
})();
