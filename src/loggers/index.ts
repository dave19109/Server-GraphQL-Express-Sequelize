/* eslint-disable no-unused-vars */
import winston from "winston";
import {
  FileTransportInstance,
  ConsoleTransportInstance,
} from "winston/lib/winston/transports";

let transports: Array<FileTransportInstance | ConsoleTransportInstance>;

transports = [
  new winston.transports.File({
    filename: "error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "combined.log",
    level: "verbose",
  }),
];

if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports,
});

export default logger;
