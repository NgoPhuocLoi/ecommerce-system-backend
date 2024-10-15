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

const uniqueLink = async (link, { req }) => {
  const themeId = Number(req.params.id);
  const foundLink = await prisma.defaultOnlineShopPages.findFirst({
    where: { link, themeId },
  });
  if (foundLink) {
    throw new BadRequest(`Page with link ${link} already exists`);
  }
};

module.exports = {
  validTheme,
  uniqueLink,
};
