
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

let pixelPath = "./pixels.json";
if (!fs.existsSync(pixelPath)) fs.writeFileSync(pixelPath, JSON.stringify(Array.from({length: 32}, () => Array(32).fill("#FFFFFF"))));

app.get("/pixels", (req, res) => {
  const data = fs.readFileSync(pixelPath, "utf8");
  res.json(JSON.parse(data));
});

app.post("/pixels", (req, res) => {
  fs.writeFileSync(pixelPath, JSON.stringify(req.body));
  res.sendStatus(200);
});

app.post("/webhook", upload.any(), async (req, res) => {
  const webhookURL = "YOUR_DISCORD_WEBHOOK_HERE";
  const form = new fetch.FormData();
  req.files.forEach(file => {
    form.append("file", file.buffer, file.originalname);
  });
  form.append("username", req.body.username || "PixelDisplay");
  form.append("content", req.body.content || "");

  const response = await fetch(webhookURL, {
    method: "POST",
    body: form
  });

  res.sendStatus(response.ok ? 200 : 500);
});

app.listen(PORT, () => console.log("✅ Servern körs på port", PORT));
