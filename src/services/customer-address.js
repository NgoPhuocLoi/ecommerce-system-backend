const { DELIVERY_ADDRESSES } = require("../constants/tenantSpecificRelations");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../utils");
const sql = require("../config/db");
const db = require("../helpers/db");
const { getById } = require("./customer");

const customerAddressService = {
  create: async (
    shopId,
    customerId,
    {
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
      phone,
      isDefault,
      detailAddress = "",
    }
  ) => {
    const deliveryAddressRel = getTenantSpecificRelation(
      shopId,
      DELIVERY_ADDRESSES
    );

    if (isDefault) {
      const updatedData = await sql`UPDATE ${sql(
        deliveryAddressRel
      )} SET is_default = false WHERE customer_id = ${customerId}`;

      console.log({ updatedData });
    }

    const newAddress = await db.create(deliveryAddressRel, {
      customer_id: customerId,
      province_id: provinceId,
      district_id: districtId,
      ward_code: wardCode,
      province_name: provinceName,
      district_name: districtName,
      ward_name: wardName,
      phone,
      is_default: isDefault,
      detail_address: detailAddress,
      is_deleted: false,
    });

    return newAddress;
  },

  getAll: async (shopId, customerId) => {
    const deliveryAddressRel = getTenantSpecificRelation(
      shopId,
      DELIVERY_ADDRESSES
    );

    const addresses = await sql`SELECT * FROM ${sql(
      deliveryAddressRel
    )} WHERE customer_id = ${customerId} ORDER BY is_default DESC`;

    return addresses.map(convertToObjectWithCamelCase);
  },

  getById: async (shopId, customerId, addressId) => {
    const deliveryAddressRel = getTenantSpecificRelation(
      shopId,
      DELIVERY_ADDRESSES
    );

    const [address] = await sql`SELECT * FROM ${sql(
      deliveryAddressRel
    )} WHERE customer_id = ${customerId} AND delivery_address_id = ${addressId}`;

    return convertToObjectWithCamelCase(address);
  },
};

module.exports = customerAddressService;
