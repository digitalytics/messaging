//@ts-check
const dotenv = require("dotenv");
const { has } = require("underscore");
dotenv.config();

const requiredParams = [
  "DEFAULT_LANGUAGE",
  "NODE_ENV",
  "MONGO_USERNAME",
  "MONGO_PASSWORD",
  "MONGO_HOST",
  "MONGO_PORT",
  "DATABASE_NAME",
  "AWS_ACCESS_KEY_ID",
  "AWS_ACCESS_SECRET_KEY",
  "AWS_REGION",
  "AWS_SES_REGION",
  "AWS_PREFIX",
  "AWS_FOLDER_PREFIX",
  "AWS_FOLDER_NAME",
  "AWS_S3_BUCKET_NAME",
  "GMAIL_USER",
  "GMAIL_CLIENT_ID",
  "GMAIL_CLIENT_SECRET",
  "GMAIL_REFRESH_TOKEN",
  "JWT_SECRET",
  "ATHENA_CLIENT_ID",
  "ATHENA_CLIENT_SECRET",
  "ATHENA_BASE_URL",
  "ATHENA_PRACTICE_ID"
];

for (let i = 0; i < requiredParams.length; i++) {
  if (!has(process.env, requiredParams[i])) {
    throw new Error("Athena EHR Platform Environment Variables Not Properly Set");
  }
}
const folderPrefix = process.env.AWS_FOLDER_PREFIX;
const DB_URL = process.env.MONGO_USERNAME
  ? `mongodb://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE_NAME}`
  : `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE_NAME}`;
module.exports = {
  defaultLanguage: process.env.DEFAULT_LANGUAGE,
  serverMode: process.env.NODE_ENV,
  MONGO_URL: DB_URL,
  aws: {
    keyId: process.env.AWS_ACCESS_KEY_ID,
    key: process.env.AWS_ACCESS_SECRET_KEY,
    region: process.env.AWS_REGION,
    sesRegion: process.env.AWS_SES_REGION,
    snsRegion: process.env.AWS_SNS_REGION,
    baseURL: process.env.AWS_PREFIX,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    folderName: process.env.AWS_FOLDER_NAME,
    prefix: process.env.AWS_PREFIX,
    s3: {
      user: `${folderPrefix}user`
    },
    S3BucketNoPrefix: {
      user: "user"
    }
  },
  JWT: {
    secret: process.env.JWT_SECRET
  },
  gmail: {
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN
  },
  ATHENA: {
    client_id: process.env.ATHENA_CLIENT_ID,
    client_secret: process.env.ATHENA_CLIENT_SECRET,
    baseURL: process.env.ATHENA_BASE_URL,
    practiceid: process.env.ATHENA_PRACTICE_ID
  }
};
