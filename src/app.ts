import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import router from './routes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://university-administration-system-fr.vercel.app',
    ],
    credentials: true,
  }),
);

// Handle preflight request
app.options('*', cors());

// Application routes
app.use('/api/v1', router);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
  });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
