import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

// Enable high-efficiency gzip/deflate compression for all text/html/js/css/json responses
app.use(compression({
  threshold: 1024,
  level: 6
}));

// Optimized static asset serving with cache-busting headers for instant preview
app.use("/assets", express.static(path.join(__dirname, "assets"), {
  setHeaders: (res, filePath) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
}));

app.use("/src/assets", express.static(path.join(__dirname, "src", "assets"), {
  setHeaders: (res, filePath) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
}));

// Serve root static assets (favicon, robots, etc.) with no-cache for instant live updates
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith("index.html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
}));

// Serve index.html for all routes with fast-revalidate headers
app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Plano Aprovação CNH 2026 server running at http://${HOST}:${PORT}`);
});
