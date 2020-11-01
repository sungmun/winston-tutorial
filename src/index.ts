import express from "express";
import cors from "cors";
import logger from "./utiles/logger";
import http from "http";

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ methods: "get, post, put, patch", origin: "*" }));
const getLogger = logger.getLogger;
app.use((req, res, next) => {
  logger.getRouterLogger.http(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    params: req.params,
    baseUrl: req.baseUrl,
    hostname: req.hostname,
    body: req.body,
    headers: req.headers,
  });
  next();
});

app.get("/", (req, res) => {
  console.log("test data e", { aaaa: "test", asds: "sda" });
  return res.json({ msg: "ok" });
});

http.createServer(app).listen(port, () => {
  logger.getLogger.info(`server start ${port}`);
});
