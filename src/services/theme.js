const prismaClient = require("../config/prismaClient");

const themeService = {
  createTheme: async ({ name, description }) => {
    const newTheme = await prismaClient.themes.create({
      data: {
        name,
        description,
      },
    });
    return newTheme;
  },

  getThemes: async () => {
    const themes = await prismaClient.themes.findMany();
    return themes;
  },

  getTheme: async (id) => {
    const theme = await prismaClient.themes.findUnique({
      where: {
        id,
      },
      include: {
        defaultPages: {
          select: {
            id: true,
            name: true,
            showInNavigation: true,
            link: true,
            position: true,
          },
        },
      },
    });
    return theme;
  },

  updateTheme: async (id, updatedData) => {
    const updatedTheme = await prismaClient.themes.update({
      where: {
        id,
      },
      data: updatedData,
    });
    return updatedTheme;
  },

  deleteTheme: async (id) => {
    const deletedTheme = await prismaClient.themes.delete({
      where: {
        id,
      },
    });
    return deletedTheme;
  },

  createPageInTheme: async (
    themeId,
    { name, description, layout = "", showInNavigation = true, link }
  ) => {
    const currentPosition = await prismaClient.defaultOnlineShopPages.count({
      where: {
        themeId,
      },
    });
    const newPage = await prismaClient.defaultOnlineShopPages.create({
      data: {
        name,
        description,
        themeId,
        position: currentPosition,
        layout,
        showInNavigation,
        link,
      },
    });
    return newPage;
  },

  getPagesInTheme: async (themeId) => {
    const pages = await prismaClient.defaultOnlineShopPages.findMany({
      where: {
        themeId,
      },
      orderBy: {
        position: "asc",
      },
    });
    return pages;
  },

  getPageInTheme: async (themeId, pageId) => {
    return "OK";
    const page = await prismaClient.pages.findUnique({
      where: {
        id: pageId,
        themeId,
      },
    });
    return page;
  },

  updatePageInTheme: async (themeId, pageId, updatedData) => {
    return "OK";
    const updatedPage = await prismaClient.pages.update({
      where: {
        id: pageId,
        themeId,
      },
      data: updatedData,
    });
    return updatedPage;
  },

  deletePageInTheme: async (themeId, pageId) => {
    return "OK";
    const deletedPage = await prismaClient.pages.delete({
      where: {
        id: pageId,
        themeId,
      },
    });
    return deletedPage;
  },
};

module.exports = themeService;
