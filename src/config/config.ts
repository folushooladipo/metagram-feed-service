import {config as loadEnvironmentVariables} from "dotenv"

loadEnvironmentVariables()

const {
  AWS_MEDIA_BUCKET_NAME,
  AWS_PROFILE,
  AWS_REGION,
  DB_NAME,
  DB_HOST,
  DB_PASSWORD,
  DB_USERNAME,
} = process.env

export const config = {
  dev: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    awsRegion: AWS_REGION,
    awsProfile: AWS_PROFILE,
    awsMediaBucket: AWS_MEDIA_BUCKET_NAME,
  },
}
