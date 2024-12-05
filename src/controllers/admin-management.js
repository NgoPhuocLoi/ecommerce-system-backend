const { OKResponse } = require("../responses/success");
const adminManagementService = require("../services/admin-management");

const adminManagementController = {
  getAccounts: async (req, res) => {
    new OKResponse({
      metadata: await adminManagementService.getAccounts(),
    }).send(res);
  },

  getAccountById: async (req, res) => {
    new OKResponse({
      metadata: await adminManagementService.getAccountById(req.params.id),
    }).send(res);
  },
};

module.exports = adminManagementController;
