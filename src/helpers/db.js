const sql = require("../config/db");
const fs = require("fs");
const create = async (relation, data) => {
  const result = await sql`insert into ${sql(relation)} ${sql(
    data
  )} returning *;`;
  return result[0];
};

const find = async (relation, filter) => {};

const createTenantSchema = async (prismaClient, id) => {
  const schemaName = id.replace(/-/g, "_");

  await prismaClient.$executeRawUnsafe(
    `CREATE SCHEMA IF NOT EXISTS "${schemaName}";`
  );

  const sqlString = fs
    .readFileSync("src/config/tenant-specific-schema.sql")
    .toString()
    .replace(/tenantSpecific/g, schemaName)
    .replace(/\n/g, "")
    .trim();

  const sqls = sqlString.split(";");
  sqls.splice(sqls.length - 1);
  console.log({ sqls });
  for (let sql of sqls) {
    console.log({ sql });
    await prismaClient.$executeRawUnsafe(sql);
  }
};

module.exports = { create, createTenantSchema };
