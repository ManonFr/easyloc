const mysql = require("mysql2/promise");
require("dotenv").config();

async function getSqlConnection() {
  const connection = await mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
    multipleStatements: true,
    ssl: false,
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(process.env.SQL_PASSWORD),
    },
  });

  return connection;
}

module.exports = { getSqlConnection };
