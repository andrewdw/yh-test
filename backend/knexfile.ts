import type { Knex } from "knex";
import { register } from 'ts-node';

// register TypeScript compiler
register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
  },
});

// load environment variables
require('dotenv').config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || "yhangry",
      user: process.env.DB_USER || "yhangry",
      password: process.env.DB_PASSWORD || "yhangry",
      port: Number(process.env.DB_PORT) || 5432
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: 'ts'
    }
  }
};

export default config;