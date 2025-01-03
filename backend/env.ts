/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from "@ioc:Adonis/Core/Env";

export default Env.rules({
  HOST: Env.schema.string({ format: "host" }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(["local", "s3"] as const),
  NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string({ format: "host" }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: "host" }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  SMTP_SENDER_ADDRESS: Env.schema.string(),
  SMTP_RECEIVER_ADDRESS: Env.schema.string(),
  SESSION_DRIVER: Env.schema.string(),
  S3_CDN_ENDPOINT_URL: Env.schema.string(),
  S3_BASE_URL: Env.schema.string(),
  S3_ENDPOINT: Env.schema.string(),
  LOGS_PATH: Env.schema.string(),
  STRIPE_SECRET: Env.schema.string(),
  FRONTEND_DOMAIN: Env.schema.string(),
  PRODUCT_PRICE_ID: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),
});
