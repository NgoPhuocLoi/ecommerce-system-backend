const { Forbidden, UnAuthorized, BadRequest } = require("../responses/error");
const { asyncHandler } = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClient");
const { getShopIdFromRequest } = require("../utils");
const { getAuth } = require("@clerk/express");

const permission = (permittedRoles) => (req, _, next) => {
  const accountRole = req.account.role;

  if (!accountRole || !permittedRoles.includes(accountRole))
    next(new Forbidden("You don't have permission to perform this action"));

  next();
};

const authentication = (req, _, next) => {
  try {
    const token = getTokenFromRequest(req);

    req.account = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    next(new UnAuthorized("Invalid token"));
  }
};

const requiredValidShopIdHeader = async (req, _, next) => {
  const shopId = getShopIdFromRequest(req);
  const auth = getAuth(req);

  if (!shopId) {
    next(new BadRequest("Shop ID is missing"));
  }

  try {
    const foundShop = await prisma.shops.findUnique({
      where: { id: shopId, accountId: auth.userId },
    });

    if (!foundShop) {
      next(new BadRequest("Invalid shop ID"));
    }

    req.shopId = shopId;

    next();
  } catch (error) {
    console.log(error);
    next(new BadRequest("Invalid shop ID"));
  }
};

const getTokenFromRequest = (req) => {
  const requestBearer = req.headers.authorization;

  if (!requestBearer) next(new UnAuthorized("Authorization required"));

  const token = requestBearer.split(" ")[1];

  if (!token) next(new UnAuthorized("Invalid token"));

  return token;
};

module.exports = { authentication, permission, requiredValidShopIdHeader };
