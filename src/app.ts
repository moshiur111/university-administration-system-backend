import express, { Application } from 'express';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

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
