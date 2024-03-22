const { HOST, PORT } = process.env;
import express from "express";
let app = express();

app.use(express.json());

let corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
};
import { allowedOrigins } from "./env.mjs";
if (allowedOrigins.length > 0)
  corsOptions.origin = function callbackIfAllowedOrigin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) == -1)
      return callback(new Error("Origin access denied due to CORS."), false);
    callback(null, true);
  };

app.listen(PORT, HOST, () => {
  console.log(
    `Listening on http://${HOST == "0.0.0.0" ? "127.0.0.1" : HOST}:${PORT}/`
  );
  // console.log("Allowed origins:" + (allowedOrigins.length > 0 ? '\n- ' + allowedOrigins.join('\n- ') : 'All.'));
});

export default app;
export { corsOptions };
