const { OKResponse } = require("../responses/success");
const GiaoHangNhanhService = require("../services/ghn");

const addressController = {
  getProvinces: async (req, res) => {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getProvinces(),
    }).send(res);
  },

  getDistricts: async (req, res) => {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getDistrictsByProvinceId(
        req.query.provinceId
      ),
    }).send(res);
  },

  getWards: async (req, res) => {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getWardsByDistrictId(
        req.query.districtId
      ),
    }).send(res);
  },
};

module.exports = addressController;
