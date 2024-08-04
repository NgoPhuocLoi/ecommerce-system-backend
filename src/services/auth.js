const { BadRequest } = require("../responses/error");
const prisma = require("../config/prismaClient");
const argon2 = require("argon2");
const { generateTokens } = require("../heplers/auth");
const fs = require("fs");
const sql = require("../config/db");

const authService = {
  register: async ({ firstName, lastName, email, password }) => {
    const foundAccount = await prisma.accounts.findUnique({
      where: {
        email,
      },
    });
    if (foundAccount) {
      throw new BadRequest("This email has already been used!");
    }
    const hashedPassword = await argon2.hash(password);

    const result = await prisma.$transaction(async (tx) => {
      const newAccount = await tx.accounts.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      const schemaName = newAccount.id.replace(/-/g, "_");

      await tx.$executeRawUnsafe(
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
        await tx.$executeRawUnsafe(sql);
      }

      return newAccount;
    });

    return result;
  },

  login: async ({ email, password }) => {
    const foundAccount = await prisma.accounts.findUnique({
      where: { email },
    });

    if (!foundAccount) {
      throw new BadRequest("Invalid credentials");
    }

    const validPassword = await argon2.verify(foundAccount.password, password);

    if (!validPassword) {
      throw new BadRequest("Invalid credentials");
    }

    const tokens = generateTokens({
      accountId: foundAccount.id,
    });

    return { tokens, account: foundAccount };
  },
};

module.exports = authService;
