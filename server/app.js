const HOST = process.env["HOST"] ?? "localhost",
  PORT = Number(process.env["PORT"]) || 8000;

import express from "express";
import cors from "cors";

const app = express();

app.listen(PORT, HOST, () => {
  console.log(
    `Listening on ${
      HOST == "0.0.0.0" ? `HTTP port ${PORT}` : `http://${HOST}:${PORT}/`
    }`
  );
});

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

export default app;
