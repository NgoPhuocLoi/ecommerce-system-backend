const prismaClient = require("../config/prismaClient");

const adminManagementService = {
  getAccounts: async () => {
    const accounts = await prismaClient.accounts.findMany({
      include: {
        shops: true,
      },
    });

    for (let account of accounts) {
      account.password = undefined;
    }

    return accounts;
  },

  getAccountById: async (id) => {
    const account = await prismaClient.accounts.findUnique({
      where: {
        id,
      },
      include: {
        shops: true,
      },
    });

    account.password = undefined;

    return account;
  },
};

module.exports = adminManagementService;
