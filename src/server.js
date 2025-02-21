import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { APP_CONFIG } from './constants/app.js';
import router from './routers/router.js';

const PORT = APP_CONFIG.PORT;

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const corsOptions = {
    origin: [
      'http://localhost:5173',
      'https://team-03-project-front.vercel.app',
    ],
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.options('*', cors(corsOptions));

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};