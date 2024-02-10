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
  res.status(404).send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.error(error); // TODO: log errors
  res.status(500).json({ message: "Internal Server Error" });
})
