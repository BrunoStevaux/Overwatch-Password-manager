/* eslint-disable object-curly-newline */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
const { createLogger, format, transports } = require("winston");
const moment = require("moment");

const { printf, combine, errors, timestamp, colorize } = format;

const customFormat = printf((info) => {
  let { timestamp, level, stack, message } = info;
  message = stack || message;
  return `[${timestamp} ${level}] | ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    // Convert log level to uppercase
    format((info) => {
      // eslint-disable-next-line no-param-reassign
      info.level = info.level.toUpperCase();
      return info;
    })(),
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  ),
  transports: [
    // Log to the console, colorized
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
    // Log all output to a rotating "out" file
    new transports.File({
      filename: `out-${moment().format("YYYY-MM-DD")}.log`,
      dirname: "./logs/",
      datePattern: "YYYY-MM-DD",
      json: false,
      format: customFormat,
    }),
  ],
});

module.exports = logger;
