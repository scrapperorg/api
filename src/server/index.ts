import 'module-alias/register';
import { Application } from 'express';
import { configServer } from './server';

function listenApp(app: Application, port: number) {
  app.listen(port, () => {
    console.log(`anap screening server started at http://localhost:${port}`);
  });
}

(async function startServer() {
  const { app, port } = await configServer();
  listenApp(app, port);
})();
