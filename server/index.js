import "./env.js";
import app from "./app.js";
import api from "./api/index.js";
import errorsHandler from "./middlewares/errors-handler.js";

import { attemptDBConnection } from "#database/connection.js";
attemptDBConnection();

app.get("/", (req, res) => {
  res.status(200).json({ code: "ALIVE" });
});

app.use("/api", api);

app.use((req, res) => {
  res.status(404).json({ code: "NOT_FOUND" });
});

app.use(errorsHandler);
