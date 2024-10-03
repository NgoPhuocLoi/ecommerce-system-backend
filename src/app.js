const express = require("express");
const compression = require("compression");
const winston = require("winston");
const {
  handleNotFoundRoute,
  errorHandler,
} = require("./middlewares/errorHandler");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const logger = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: "info",
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  // Log to the console
  transports: [new winston.transports.Console()],
});

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(clerkMiddleware());
// app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  // Log an info message for each incoming request
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.use("/api", require("./routes"));
app.use(handleNotFoundRoute);
app.use(errorHandler);

module.exports = app;
