const { BadRequest } = require("../responses/error");
const prisma = require("../config/prismaClient");
const argon2 = require("argon2");
const { generateTokens } = require("../heplers/auth");

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
    const newAccount = await prisma.accounts.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return newAccount;
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
