import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

// создаём Express-приложение без listen()
const app = express();

app.get("/health", (_, res) => res.send("ok"));

app.use(
  "/waw",
  createProxyMiddleware({
    target: "http://185.87.49.204:2099",
    changeOrigin: true,
    ws: true,
    secure: false,
    headers: { "X-Forwarded-Proto": "http" },
    pathRewrite: { "^/waw": "" },
    onProxyReq: (proxyReq, req) =>
      console.log(`[Proxy] ${req.method} ${req.originalUrl}`),
    onError: (err, req, res) => {
      console.error(`[Proxy Error] ${err.message}`);
      res.status(502).send("Bad gateway");
    },
  })
);

// экспортируем как handler для Scaleway
export default app;
