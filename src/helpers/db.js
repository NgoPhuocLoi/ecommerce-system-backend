const sql = require("../config/db");

const create = async (relation, data) => {
  const result = await sql`insert into ${sql(relation)} ${sql(
    data
  )} returning *;`;
  return result[0];
};

const find = async (relation, filter) => {};

module.exports = { create };
