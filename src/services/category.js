const prisma = require("../config/prismaClient");
const { buildCategoryFilter } = require("../helpers/category");

const categoryService = {
  getByQuery: async (query) => {
    const result = await prisma.categories.findMany({
      where: buildCategoryFilter(query),
      include: {
        recommendAttributes: {
          include: {
            recommendAttribute: {
              include: {
                values: true,
              },
            },
          },
        },
      },
    });

    for (let category of result) {
      const hasChild = await prisma.categories.count({
        where: {
          parentId: category.id,
        },
      });

      category.hasChild = hasChild > 0;
    }
    return result.map((category) => ({
      ...category,
      recommendAttributes: category.recommendAttributes.map(
        (recommendAttribute) => ({
          ...recommendAttribute.recommendAttribute,
        })
      ),
    }));
  },
};

module.exports = categoryService;
