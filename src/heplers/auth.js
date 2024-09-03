const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateTokens = (payload) => {
  const accessTokenId = uuidv4();
  const accessToken = jwt.sign(
    { ...payload, id: accessTokenId },
    process.env.JWT_SECRET,
    {
      expiresIn: 1 * 60 * 60,
    }
  );
  const refreshToken = jwt.sign({ accessTokenId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
