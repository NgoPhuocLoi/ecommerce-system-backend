const { ghnFetch } = require("../utils/ghn-fetch");

class GiaoHangNhanhService {
  static async getProvinces() {
    const res = await ghnFetch({
      url: `${process.env.GHN_ADDRESS_API_URL}/province`,
    });

    return (await res.json()).data;
  }

  static async getDistrictsByProvinceId(provinceId) {
    const res = await ghnFetch({
      url: `${process.env.GHN_ADDRESS_API_URL}/district?province_id=${provinceId}`,
    });

    console.log({ res });

    return (await res.json()).data;
  }

  static async getWardsByDistrictId(districtId) {
    const res = await ghnFetch({
      url: `${process.env.GHN_ADDRESS_API_URL}/ward?district_id=${districtId}`,
    });

    return (await res.json()).data;
  }

  static async getStoreInformation() {
    const res = await ghnFetch({
      url: `${process.env.GHN_V2_API_URL}/shop/all`,
      method: "POST",
      body: {
        offset: 0,
        limit: 1,
      },
    });

    return (await res.json()).data;
  }

  static async getAvailableShippingServices({
    shopId,
    fromDistrictId,
    toDistrictId,
  }) {
    const res = await ghnFetch({
      url: `${process.env.GHN_V2_API_URL}/shipping-order/available-services`,
      method: "POST",
      body: {
        shop_id: shopId,
        from_district: fromDistrictId,
        to_district: toDistrictId,
      },
    });
    const jsonData = await res.json();
    console.log({ jsonData });
    return jsonData.data;
  }

  static async calculateOrderFee(
    shopId,
    {
      fromDistrictId,
      fromWardCode,
      toDistrictId,
      toWardCode,
      serviceId,
      weightInGram,
    }
  ) {
    const res = await ghnFetch({
      url: `${process.env.GHN_V2_API_URL}/shipping-order/fee`,
      method: "POST",
      body: {
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        service_id: serviceId,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        weight: weightInGram,
      },
    });

    return await res.json();
  }
}

module.exports = GiaoHangNhanhService;
