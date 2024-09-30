const prisma = require("../config/prismaClient");
const db = require("../helpers/db");

const shopService = {
  create: async ({ accountId, name }) => {
    const result = await prisma.$transaction(
      async (tx) => {
        const newShop = await tx.shops.create({
          data: {
            name,
            accountId: accountId,
            updatedAt: new Date(),
          },
        });

        await db.createTenantSchema(tx, newShop.id);

        return newShop;
      },
      {
        maxWait: 5000,
        timeout: 20000,
      }
    );

    return result;
  },

  getByAccountId: async ({ accountId }) => {
    const result = await prisma.shops.findMany({
      where: {
        accountId,
      },
    });

    return result;
  },

  // getShopById: async ({ accountId, shopId }) => {
  //   const relation = getTenantSpecificRelation(accountId, SHOPS);

  //   const result = await sql`select * from ${sql(
  //     relation
  //   )} where id = ${shopId}`;

  //   return result[0];
  // },
};

module.exports = shopService;
