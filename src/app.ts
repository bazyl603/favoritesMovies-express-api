import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './error/NotFoundError';
import router from './Routers/router';

const app = express();
app.use(express.json());
app.use(cors());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Access-Control-Allow-Orgin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
  });

app.get('/favicon.ico', (req, res) => res.status(204));


app.use('/', router);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export default app;