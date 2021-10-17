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
  DEPLOYED_WITH,
  DEPLOYED_WITH_ACCESS_KEY_ID,
  DEPLOYED_WITH_SECRET_ACCESS_KEY,
  FRONTEND_APP_URL,
  NODE_ENV,
  PORT,
} = process.env

export const config = {
  isLocalEnv: NODE_ENV === "local",
  port: PORT,
  authEndpoint: AUTH_ENDPOINT,
  frontendUrl: FRONTEND_APP_URL,

  // For use in non-EC2 deployment envs e.g EKS.
  deployedWith: DEPLOYED_WITH,
  deployedWithAccessKeyId: DEPLOYED_WITH_ACCESS_KEY_ID,
  deployedWithSecretAccessKey: DEPLOYED_WITH_SECRET_ACCESS_KEY,

  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: "postgres",

  awsRegion: AWS_REGION,
  awsProfile: AWS_PROFILE,
  awsMediaBucket: AWS_MEDIA_BUCKET_NAME,
}
