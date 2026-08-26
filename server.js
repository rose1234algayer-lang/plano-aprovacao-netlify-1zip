import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// Enable high-efficiency gzip/deflate compression for all text/html/js/css/json responses
app.use(compression({
  threshold: 1024,
  level: 6
}));

// Optimized static asset serving with caching headers
app.use("/assets", express.static(path.join(__dirname, "assets"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html") || filePath.endsWith(".js")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else if (/\.(png|jpg|jpeg|webp|svg|gif|ico|woff2|woff|ttf)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
}));

// Serve root static assets (favicon, robots, etc.)
app.use(express.static(__dirname, {
  maxAge: "1d"
}));

// Serve index.html for all routes with fast-revalidate headers
app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Plano Aprovação CNH 2026 server running at http://${HOST}:${PORT}`);
});
