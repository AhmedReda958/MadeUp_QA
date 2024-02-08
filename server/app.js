const { HOST, PORT } = process.env;
import express from "express";
let app; export default app = express();

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST == "0.0.0.0" ? "localhost" : HOST}:${PORT}/`);
});
