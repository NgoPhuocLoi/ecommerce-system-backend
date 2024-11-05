const prismaClient = require("../config/prismaClient");

const themeService = {
  createTheme: async ({ name, description, recommendedForCategoryId }) => {
    const newTheme = await prismaClient.themes.create({
      data: {
        name,
        recommendedForCategoryId: recommendedForCategoryId ?? null,
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
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    return theme;
  },

  updateTheme: async (id, updatedData) => {
    console.log({ id, updatedData });
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

  updatePagesPositionInTheme: async (themeId, pageIdsInOrder) => {
    const updatedPages = await prismaClient.$transaction(async (tx) => {
      const result = await Promise.all(
        pageIdsInOrder.map((pageId, index) => {
          return tx.defaultOnlineShopPages.update({
            where: {
              id: pageId,
              themeId,
            },
            data: {
              position: index,
            },
          });
        })
      );

      return result;
    });
    return updatedPages;
  },

  getPagesInTheme: async (themeId, includeLayout) => {
    const selectOptions = {
      id: true,
      name: true,
      showInNavigation: true,
      link: true,
      position: true,
    };

    if (includeLayout) {
      selectOptions.layout = true;
    }

    const pages = await prismaClient.defaultOnlineShopPages.findMany({
      where: {
        themeId,
      },
      orderBy: {
        position: "desc",
      },
      select: selectOptions,
    });
    return pages;
  },

  getPageInTheme: async (themeId, pageId) => {
    const page = await prismaClient.defaultOnlineShopPages.findUnique({
      where: {
        id: pageId,
        themeId,
      },
    });
    return page;
  },

  updatePageInTheme: async (themeId, pageId, updatedData) => {
    const updatedPage = await prismaClient.defaultOnlineShopPages.update({
      where: {
        id: pageId,
        themeId,
      },
      data: updatedData,
    });
    return updatedPage;
  },

  deletePageInTheme: async (themeId, pageId) => {
    const deletedPage = await prismaClient.defaultOnlineShopPages.delete({
      where: {
        id: pageId,
        themeId,
      },
    });
    return deletedPage;
  },
};

module.exports = themeService;
