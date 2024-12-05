const { OKResponse } = require("../responses/success");
const { BadRequest } = require("../responses/error");
const sql = require("../config/db");
const { getShopIdFromRequest } = require("../utils");
const { ORDERS } = require("../constants/tenantSpecificRelations");
const { getTenantSpecificRelation, sortObject } = require("../utils");
const moment = require("moment");
const paymentService = require("../services/payment");

const paymentController = {
  createPaymentUrl: async (req, res) => {
    const orderId = +req.body.orderId;
    const shopId = getShopIdFromRequest(req);
    const customerId = req.account.accountId;
    const orderRel = getTenantSpecificRelation(shopId, ORDERS);

    const foundOrder = await sql`
        SELECT * FROM ${sql(
          orderRel
        )} WHERE order_id = ${orderId} AND buyer_id = ${customerId}
    `;

    if (!foundOrder.length) {
      throw new BadRequest("Order not found");
    }

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const createDate = moment(new Date()).format("YYYYMMDDHHmmss");

    const orderInfo = "Thanh toan qua VNPay cho don hang voi ma " + orderId;
    const orderType = 200000;
    const returnUrl = `${process.env.BACKEND_URL}/api/customers/payments/vnpay_return`;
    const txnRef =
      orderId + "__" + shopId + "__" + moment(new Date()).format("HHmmss");
    let VNPayParams = {};
    VNPayParams["vnp_Version"] = "2.1.0";
    VNPayParams["vnp_Command"] = "pay";
    VNPayParams["vnp_TmnCode"] = process.env.VNPAY_TMM_CODE;
    // VNPayParams['vnp_Merchant'] = ''
    VNPayParams["vnp_Locale"] = "vn";
    VNPayParams["vnp_CurrCode"] = "VND";
    VNPayParams["vnp_TxnRef"] = txnRef;
    VNPayParams["vnp_OrderInfo"] = orderInfo;
    VNPayParams["vnp_OrderType"] = orderType;
    VNPayParams["vnp_Amount"] = +req.body.amount * 100;
    VNPayParams["vnp_ReturnUrl"] = returnUrl;
    VNPayParams["vnp_IpAddr"] = ipAddr;
    VNPayParams["vnp_CreateDate"] = createDate;
    // VNPayParams["shop_id"] = "TesCode";

    VNPayParams = sortObject(VNPayParams);

    let querystring = require("qs");
    let signData = querystring.stringify(VNPayParams, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    VNPayParams["vnp_SecureHash"] = signed;
    // await redisClient.set(txnRef, shopId, "EX", 60);

    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    vnpUrl += "?" + querystring.stringify(VNPayParams, { encode: false });

    new OKResponse({
      metadata: {
        redirectUrl: vnpUrl,
      },
    }).send(res);
  },

  handleVNPayReturn: async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.VNPAY_TMM_CODE;
    let secretKey = process.env.VNPAY_HASH_SECRET;
    const refs = vnp_Params["vnp_TxnRef"].split("__");
    const orderId = refs[0];
    const shopId = refs[1];

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      // console.log({ signed, secureHash });
      // const shopId = await redisClient.get(secureHash);
      console.log({ shopId });
      await paymentService.updatePaymentStatusOfOrder(
        shopId,
        orderId,
        vnp_Params["vnp_ResponseCode"]
      );
      // await redisClient.del(secureHash);
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      //   await OrderService.updatePaymentStatus(
      //     +orderId,
      //     vnp_Params["vnp_ResponseCode"]
      //   );
      console.log({ code: vnp_Params["vnp_ResponseCode"] });
      // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
      const [shop] = await sql`SELECT domain FROM shops WHERE id = ${shopId}`;
      res.redirect(
        `http://${shop.domain}.${process.env.FRONTEND_DOMAIN}/tai-khoan/don-hang/${orderId}?code=${vnp_Params["vnp_ResponseCode"]}`
      );
    } else {
      res.json({ code: "97" });
    }
  },
};

module.exports = paymentController;
