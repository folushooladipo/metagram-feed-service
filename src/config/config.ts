import {config as loadEnvironmentVariables} from "dotenv"

loadEnvironmentVariables()

const {
  AUTH_ENDPOINT,
  AWS_MEDIA_BUCKET_NAME,
  AWS_PROFILE,
  AWS_REGION,
  DB_NAME,
  DB_HOST,
  DB_PASSWORD,
  DB_USERNAME,
  FRONTEND_APP_URL,
  NODE_ENV,
  PORT,
} = process.env

export const config = {
  isLocalEnv: NODE_ENV === "local",
  port: PORT,
  authEndpoint: AUTH_ENDPOINT,
  frontendUrl: FRONTEND_APP_URL,

  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: "postgres",

  awsRegion: AWS_REGION,
  awsProfile: AWS_PROFILE,
  awsMediaBucket: AWS_MEDIA_BUCKET_NAME,
}
