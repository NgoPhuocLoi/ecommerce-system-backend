const sql = require("../config/db");
const db = require("../helpers/db");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../utils");
const { CUSTOMERS } = require("../constants/tenantSpecificRelations");
const argon2 = require("argon2");
const { BadRequest } = require("../responses/error");
const { generateTokens } = require("../helpers/auth");

const customerService = {
  createCustomerForShop: async (
    shopId,
    { firstName, lastName, email, password }
  ) => {
    const customerRelation = getTenantSpecificRelation(shopId, CUSTOMERS);

    const [foundCustomer] = await sql`SELECT id FROM ${sql(
      customerRelation
    )} WHERE email = ${email};`;
    if (foundCustomer) {
      throw new BadRequest("This email has already been used!");
    }
    const hashedPassword = await argon2.hash(password);

    const preparedData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log({ preparedData });

    const result = await db.create(customerRelation, preparedData);

    return result;
  },

  login: async (shopId, { email, password }) => {
    if (!email || !password) {
      throw new BadRequest("Invalid credentials");
    }

    const [foundAccount] = await sql`SELECT * FROM ${sql(
      getTenantSpecificRelation(shopId, CUSTOMERS)
    )} WHERE email = ${email};`;

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

    foundAccount.password = undefined;

    return { tokens, account: convertToObjectWithCamelCase(foundAccount) };
  },

  getById: async (shopId, customerId) => {
    const customerRelation = getTenantSpecificRelation(shopId, CUSTOMERS);

    const [foundCustomer] =
      await sql`SELECT id, first_name, last_name, email, created_at FROM ${sql(
        customerRelation
      )} WHERE id = ${customerId};`;

    return convertToObjectWithCamelCase(foundCustomer);
  },
};

module.exports = customerService;
