import pino from "pino";
import pinoHttp from "pino-http";

const logger = pino({
  level: "info",
});

const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      path: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
export default logger;
export { httpLogger };
