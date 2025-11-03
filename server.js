import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import https from "https";
import fs from "fs";

const app = express();

// --- если у Timeweb есть встроенный TLS, просто используй app.listen(process.env.PORT)
// --- если нужен собственный TLS сертификат:
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.crt")
};

// --- обычный HTTP/WS reverse proxy
app.use("/waw", createProxyMiddleware({
  target: "https://backend1.example.com", // твой backend
  changeOrigin: true,
  ws: true, // поддержка WebSocket
  secure: false, // если у бэкенда self-signed
  headers: {
    "X-Forwarded-Proto": "https"
  }
}));

https.createServer(options, app).listen(process.env.PORT || 8080, () => {
  console.log("Reverse proxy запущен на порту", process.env.PORT || 8080);
});
