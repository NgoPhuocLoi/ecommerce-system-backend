const { CreatedResponse, OKResponse } = require("../responses/success");
const themeService = require("../services/theme");

const themeController = {
  createTheme: async (req, res) => {
    new CreatedResponse({
      metadata: await themeService.createTheme(req.body),
    }).send(res);
  },

  getThemes: async (req, res) => {
    new OKResponse({
      metadata: await themeService.getThemes(),
    }).send(res);
  },

  getTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new OKResponse({
      metadata: await themeService.getTheme(themeId),
    }).send(res);
  },

  updateTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new OKResponse({
      metadata: await themeService.updateTheme(themeId, req.body),
    }).send(res);
  },

  updatePagesPositionInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new OKResponse({
      metadata: await themeService.updatePagesPositionInTheme(
        themeId,
        req.body.pageIdsInOrder
      ),
    }).send(res);
  },

  deleteTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new OKResponse({
      metadata: await themeService.deleteTheme(themeId),
    }).send(res);
  },

  createPageInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new CreatedResponse({
      metadata: await themeService.createPageInTheme(themeId, req.body),
    }).send(res);
  },

  getPagesInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    new OKResponse({
      metadata: await themeService.getPagesInTheme(
        themeId,
        req.query.includeLayout
      ),
    }).send(res);
  },

  getPageInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    const pageId = Number(req.params.pageId);
    new OKResponse({
      metadata: await themeService.getPageInTheme(themeId, pageId),
    }).send(res);
  },

  updatePageInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    const pageId = Number(req.params.pageId);
    new OKResponse({
      metadata: await themeService.updatePageInTheme(themeId, pageId, req.body),
    }).send(res);
  },

  deletePageInTheme: async (req, res) => {
    const themeId = Number(req.params.id);
    const pageId = Number(req.params.pageId);
    new OKResponse({
      metadata: await themeService.deletePageInTheme(themeId, pageId),
    }).send(res);
  },
};

module.exports = themeController;
