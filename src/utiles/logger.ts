import winston from "winston";
import dailyRotate from "winston-daily-rotate-file";
const serviceName = require("../../package.json").name;
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  defaultMeta: { service: serviceName },
});
if (process.env.NODE_ENV === "developer") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level} ${info.message}`
        )
      ),
      level: "silly",
    })
  );
}
const routerLogger = logger.child({ name: "routerLogger" });
logger.add(
  new dailyRotate({
    level: "info",
    dirname: "./logs",
    filename: `${serviceName}-service-%DATE%`,
    extension: ".log",
    format: winston.format.combine(
      winston.format((info) => info.level !== "http" && info)(),
      winston.format.json()
    ),
    json: true,
  })
);
routerLogger.add(
  new dailyRotate({
    level: "http",
    dirname: "./logs",
    extension: ".log",
    filename: `${serviceName}-access-%DATE%`,
    format: winston.format.combine(
      winston.format((info) => info.level === "http" && info)(),
      winston.format.json()
    ),
    json: true,
  })
);

global.console.log = (...data: any) => {
  const [message, meta, ...etc] = data;
  logger.info(message, { meta }, ...etc);
};

export default { getLogger: logger, getRouterLogger: routerLogger };
