const productController = {
  create: async (req, res) => {
    res.send("Create");
  },
  getAll: async (req, res) => {
    res.send("getAll");
  },
  update: async (req, res) => {
    res.send("Update");
  },
  delete: async (req, res) => {
    res.send("Delete");
  },
};

module.exports = productController;
