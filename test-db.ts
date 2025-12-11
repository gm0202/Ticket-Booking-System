import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Force dotenv to load `.env` from this folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("---- DEBUG ENV VALUES ----");
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
});
console.log("---------------------------\n");

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false   // ❗ MUST BE FALSE — PostgreSQL on Windows does NOT support SSL
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL!");
    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
