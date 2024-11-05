const ghnFetch = async ({ url, method = "GET", body }) => {
  return await fetch(url, {
    method,
    headers: {
      Token: process.env.GHN_TOKEN_API,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

module.exports = {
  ghnFetch,
};
