import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASSWORD,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expires_in: process.env
    .JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expires_in: process.env
    .JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  super_admin_id: process.env.SUPER_ADMIN_ID,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
};

export default config;
