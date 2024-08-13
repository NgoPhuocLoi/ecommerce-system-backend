const prisma = require("../../config/prismaClient");
const { BadRequest } = require("../../responses/error");

const validCategory = async (categoryId) => {
  const foundCategory = await prisma.categories.findUnique({
    where: { id: categoryId },
  });
  if (!foundCategory) {
    throw new BadRequest(`Category with id ${categoryId} does not exist`);
  }
};

module.exports = {
  validCategory,
};
