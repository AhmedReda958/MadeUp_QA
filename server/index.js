import "./env.js";
import app from "./app.js";
import api from "./api/index.js";

import { attemptDBConnection } from "#database/connection.js";
attemptDBConnection();

app.get("/", (req, res) => {
  res.send("Backend is alive!");
});

app.use("/api", api);

app.use((req, res) => {
  res.status(404).json({ code: "NOT_FOUND" });
});

app.use((err, req, res, next) => {
  console.error(err); // TODO: log errors
  res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
})
