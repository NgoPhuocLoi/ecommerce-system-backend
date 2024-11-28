const { BadRequest } = require("../responses/error");
const prisma = require("../config/prismaClient");
const argon2 = require("argon2");
const { generateTokens } = require("../helpers/auth");

const authService = {
  register: async ({ first_name, last_name, email_addresses, id }) => {
    const email = email_addresses[0].email_address;
    console.log(first_name, last_name, email, id);
    const foundAccount = await prisma.accounts.findUnique({
      where: {
        email,
      },
    });
    if (foundAccount) {
      throw new BadRequest("This email has already been used!");
    }
    const hashedPassword = await argon2.hash(id);

    const result = await prisma.accounts.create({
      data: {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        password: hashedPassword,
      },
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
