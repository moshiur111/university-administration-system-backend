import express, { Application } from 'express';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';

const app: Application = express();

// Middlewares
app.use(express.json());

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
