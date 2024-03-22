const { HOST, PORT } = process.env;
import express from "express";
import cors from "cors";

let app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, HOST, () => {
  console.log(
    `Listening on http://${HOST == "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT}/`
  );
  // console.log("Allowed origins:" + (allowedOrigins.length > 0 ? '\n- ' + allowedOrigins.join('\n- ') : 'All.'));
});

export default app;
