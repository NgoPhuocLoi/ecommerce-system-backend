const { convertToObjectWithCamelCase } = require("../utils");
const GiaoHangNhanhService = require("./ghn");

const shippingService = {
  calculateShippingCost: async ({ toDistrictId, toWardCode, weightInGram }) => {
    const shopInfo = (await GiaoHangNhanhService.getStoreInformation())
      .shops[0];
    console.log({ shopInfo });
    const prepareData = {
      shopId: shopInfo._id,
      fromDistrictId: shopInfo.district_id,
      toDistrictId,
    };

    const availableServices =
      await GiaoHangNhanhService.getAvailableShippingServices(prepareData);

    const DEFAULT_SERVICE_ID = availableServices[0].service_id;

    const orderFee = await GiaoHangNhanhService.calculateOrderFee(
      shopInfo._id,
      {
        serviceId: DEFAULT_SERVICE_ID,
        fromDistrictId: shopInfo.district_id,
        fromWardCode: shopInfo.ward_code,
        toDistrictId,
        toWardCode,
        weightInGram,
      }
    );

    return convertToObjectWithCamelCase(orderFee.data);
  },
};

module.exports = shippingService;
