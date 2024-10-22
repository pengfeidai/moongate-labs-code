import { config } from 'dotenv';
config({ path: '.env' });

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const ENV = process.env.NODE_ENV || 'dev';
export const JWT_SECRET_DEFAULT = 'jwt_secret@123123';

export const { PORT, JWT_SECRET } = process.env;
