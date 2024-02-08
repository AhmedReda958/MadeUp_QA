import express from "express";
let app; export default app = express();

let { HOST, PORT } = process.env;
if (!HOST) HOST = "0.0.0.0";
PORT = Number(PORT) || 8000;

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST == "0.0.0.0" ? "localhost" : HOST}:${PORT}/`);
});
