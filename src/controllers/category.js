const { OKResponse } = require("../responses/success");
const categoryService = require("../services/category");

const categoryController = {
  getByQuery: async (req, res) => {
    const query = req.query;
    new OKResponse({
      metadata: await categoryService.getByQuery(query),
    }).send(res);
  },

  getTopLevelCategories: async (req, res) => {
    new OKResponse({
      metadata: await categoryService.getTopLevelCategories(),
    }).send(res);
  },
};

module.exports = categoryController;
