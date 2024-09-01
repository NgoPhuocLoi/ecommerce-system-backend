const postgres = require("postgres");

const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "ecommerce-system",
  username: "postgres",
  password: "postgres",
  transform: postgres.fromCamel,
}); // will use psql environment variables

module.exports = sql;
