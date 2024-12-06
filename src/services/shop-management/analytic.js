const {
  ORDERS,
  ITEMS_IN_CART,
  ORDER_DETAILS,
  PAYMENTS,
  PRODUCT_VARIANTS,
  PRODUCTS,
  PRODUCTS_IMAGES,
  UPLOADED_IMAGES,
  VARIANT_HAS_OPTION_WITH_VALUE,
  ATTRIBUTE_VALUES,
  DELIVERY_ADDRESSES,
  CUSTOMERS,
} = require("../../constants/tenantSpecificRelations");
const { ORDER_STATUS } = require("../../constants/publicRelations");
const {
  getTenantSpecificRelation,
  convertToObjectWithCamelCase,
} = require("../../utils");
const { BadRequest } = require("../../responses/error");
const sql = require("../../config/db");

const shopManagementAnalytic = {
  getOverviewAnalytics: async (shopId) => {},
};
