import { Server } from 'http';
import app from './app';
import config from './config';
import connectDB from './config/database';
import seedSuperAdmin from './modules/admin/admin.seed';

let server: Server;

const startServer = async () => {
  try {
    await connectDB();

    await seedSuperAdmin();
    const port = config.port || 5000;

    server = app.listen(port, () => {
      console.log(`Server is running or port ${port}`);
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
