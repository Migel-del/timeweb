import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 8080;

// --- healthcheck (чтобы контейнер считался готовым)
app.get("/health", (_, res) => res.send("ok"));

// --- HTTP/WS reverse proxy на твою ноду
app.use("/waw", createProxyMiddleware({
  target: "http://185.87.49.204:2099", // <-- твоя нода
  changeOrigin: true,
  ws: true,           // поддержка WebSocket
  secure: false,      // не проверять SSL (т.к. http)
  headers: {
    "X-Forwarded-Proto": "http"
  },
  pathRewrite: {
    "^/waw": ""        // чтобы запрос /waw/... шёл напрямую на backend без префикса
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(502).send("Bad gateway");
  }
}));

// --- запуск сервера
app.listen(PORT, () => {
  console.log(`Reverse proxy запущен на порту ${PORT}, проксирует к 185.87.49.204:2099`);
});
