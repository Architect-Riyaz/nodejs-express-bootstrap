import winston from "winston"
import "winston-daily-rotate-file"

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
})

const logger = winston.createLogger({
  transports: [transport],
})

const logRequest = (req, res, next) => {
  logger.info("Request:", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    cookies: req.cookies,
  })

  next()
}

const paymentsTransport = new winston.transports.DailyRotateFile({
  filename: "logs/payments/payments-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
})

export const paymentsLogger = winston.createLogger({
  transports: [paymentsTransport],
})

const withdrawalsTransport = new winston.transports.DailyRotateFile({
  filename: "logs/withdrawals/withdrawals-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
})

export const withdrawalsLogger = winston.createLogger({
  transports: [withdrawalsTransport],
})

export default logRequest
