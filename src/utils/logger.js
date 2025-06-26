import winston from "winston";
import { config } from "../config/app.config.js";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: config.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    config.NODE_ENV === "development" ? colorize() : winston.format.json(),
    align(),
    logFormat
  ),
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

if (config.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

logger.morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
