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
  port: 3306,
};

module.exports = {
  development: { ...config },
  production: { ...config },
};
