const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
console.log("RUN FILE");
module.exports = prisma;
