import {Sequelize} from "sequelize-typescript"
import {readFileSync} from "fs"

import {config} from "./config/config"

const {isLocalEnv} = config
const dialectOptions = isLocalEnv
  ? {}
  : {
    ssl: {
      require: true,
      ca: readFileSync(`${__dirname}/us-east-1-bundle.pem`),
    },
  }

export const sequelize = new Sequelize({
  username: config.username,
  password: config.password,
  database: config.database,
  host: config.host,
  dialect: "postgres",
  ssl: isLocalEnv ? false : true,
  dialectOptions,
  logging: false,
})
