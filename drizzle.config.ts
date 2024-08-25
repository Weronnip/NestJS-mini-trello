import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: './src/.env' });

export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  verbose: true,
  strict: true,
  out: './out',
});
