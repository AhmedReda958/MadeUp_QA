const HOST = process.env["HOST"] ?? "0.0.0.0",
  PORT = Number(process.env["PORT"]) || 8000;

import express from "express";

const app = express();

app.listen(PORT, HOST, () => {
  console.log(
    `Listening on ${
      HOST == "0.0.0.0" ? `HTTP port ${PORT}` : `http://${HOST}:${PORT}/`
    }`
  );
});

export default app;
