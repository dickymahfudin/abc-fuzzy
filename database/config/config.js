require('dotenv').config();

const { DB_HOST, DB_CONNECTION, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;
const username = DB_USERNAME;
const password = DB_PASSWORD;
const database = DB_DATABASE;
const host = DB_HOST;
const dialect = DB_CONNECTION;
const config = {
  username,
  password,
  database,
  host,
  dialect,
  timezone: '+07:00',
  logging: false,
};

module.exports = {
  development: { ...config },
  production: {
    ...config,
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
