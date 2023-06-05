import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const env = {
  PORT: process.env.PORT,
  MONGO_BASE_NAME: process.env.MONGO_BASE_NAME,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  HOST_REDIS: process.env.HOST_REDIS,
  PORT_REDIS: process.env.PORT_REDIS,
  KEY_TOKEN_JWT: process.env.KEY_TOKEN_JWT,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS,
};

export default env;
