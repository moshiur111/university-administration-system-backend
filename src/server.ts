import app from './app';
import config from './config';
import { Server } from 'http';
import connectDB from './config/database';

let server: Server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`Server is running or port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('🚫 Unhandled Rejection detected');
  console.error(err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('🚫 Uncaught Exception detected');
  console.error(err);
  process.exit(1);
});
