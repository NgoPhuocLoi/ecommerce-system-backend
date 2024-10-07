const prisma = require("../../config/prismaClient");
const { BadRequest } = require("../../responses/error");

const validTheme = async (themeId) => {
  const id = Number(themeId);
  const foundTheme = await prisma.themes.findUnique({
    where: { id },
  });
  if (!foundTheme) {
    throw new BadRequest(`Theme with id ${themeId} does not exist`);
  }
};

module.exports = {
  validTheme,
};
