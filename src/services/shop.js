const prisma = require("../config/prismaClient");
const db = require("../helpers/db");
const { BadRequest } = require("../responses/error");
const { getTenantSpecificRelation } = require("../utils");

const shopService = {
  create: async (data) => {
    let defaultTheme;

    if (data.themeId) {
      defaultTheme = await prisma.themes.findUnique({
        where: {
          id: data.themeId,
        },
      });
    } else {
      defaultTheme = await prisma.themes.findFirst({});
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const newShop = await tx.shops.create({
          data: {
            name: data.name,
            hasUsedPlatformBefore: data.hasUsedPlatformBefore,
            hasConfirmedEmail: data.hasConfirmedEmail,
            provinceId: data.provinceId,
            provinceName: data.provinceName,
            districtId: data.districtId,
            districtName: data.districtName,
            wardId: data.wardId,
            wardCode: data.wardCode,
            wardName: data.wardName,
            detailAddress: data.detailAddress ?? "",
            phone: data.phone,
            account: {
              connect: {
                id: data.accountId,
              },
            },
            theme: {
              connect: {
                id: defaultTheme.id,
              },
            },
            domain: data.domain,
            mainCategoryToSell: {
              connect: {
                id: data.mainCategoryIdToSell,
              },
            },
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

    const defaultPages = await prisma.defaultOnlineShopPages.findMany({
      where: {
        themeId: defaultTheme.id,
      },
      select: {
        id: true,
        name: true,
        showInNavigation: true,
        link: true,
        position: true,
        layout: true,
      },
    });

    await db.create(getTenantSpecificRelation(result.id, "online_shops"), {
      default_header_layout: defaultTheme.defaultHeaderLayout,
      default_footer_layout: defaultTheme.defaultFooterLayout,
      theme_id: defaultTheme.id,
      updated_at: new Date(),
    });

    for (let page of defaultPages) {
      await db.create(
        getTenantSpecificRelation(result.id, "online_shop_pages"),
        {
          name: page.name,
          show_in_navigation: page.showInNavigation,
          link: page.link,
          position: page.position,
          layout: page.layout,
          created_by_default: true,
        }
      );
    }

    return result;
  },

  getByAccountId: async ({ accountId }) => {
    const result = await prisma.shops.findMany({
      where: {
        accountId,
      },
    });
    console.log({ result });
    return result;
  },

  getByDomain: async (domain) => {
    const result = await prisma.shops.findUnique({
      where: {
        domain,
      },
    });

    if (!result) {
      throw new BadRequest("Shop not found");
    }

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
