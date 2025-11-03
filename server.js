import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 8080;

// --- проверка готовности контейнера (healthcheck)
app.get("/health", (_, res) => res.send("ok"));

// --- обычный HTTP/WS reverse proxy
app.use("/waw", createProxyMiddleware({
  target: "https://backend1.example.com", // твой backend
  changeOrigin: true,
  ws: true,           // поддержка WebSocket
  secure: false,      // не проверять SSL backend
  headers: {
    "X-Forwarded-Proto": "https"
  }
}));

// --- запуск обычного HTTP сервера (без TLS)
app.listen(PORT, () => {
  console.log(`Reverse proxy запущен на порту ${PORT}`);
});
