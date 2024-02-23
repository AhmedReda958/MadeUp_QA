import "./env.mjs";
import app from "./app.mjs";
import api from "./api/index.mjs";
import errorsHandler from "#middlewares/errors-handler.mjs";

import { attemptDBConnection } from "#database/connection.mjs";
attemptDBConnection();

app.get("/", (req, res) => {
  res.status(200).json({ code: "ALIVE" });
});

app.use("/api", api);

app.use((req, res) => {
  res.status(404).json({ code: "NOT_FOUND" });
});

app.use(errorsHandler);
