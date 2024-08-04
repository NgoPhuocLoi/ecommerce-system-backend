const prisma = require("../config/prismaClient");
const { buildCategoryFilter } = require("../helpers/category");

const categoryService = {
  getByQuery: async (query) => {
    const result = await prisma.categories.findMany({
      where: buildCategoryFilter(query),
    });
    for (let category of result) {
      const hasChild = await prisma.categories.count({
        where: {
          parentId: category.id,
        },
      });

      category.hasChild = hasChild > 0;
    }
    return result;
  },
};

module.exports = categoryService;
