import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Access-Control-Allow-Orgin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
  });

app.get('/favicon.ico', (req, res) => res.status(204));

app.all('*', async (req, res) => {
    res.status(404).send('404 Not Found');
});

app.use(errorHandler);

export default app;