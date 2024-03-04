const { HOST, PORT } = process.env;
import express from "express";
import cors from "cors";
let app = express();

app.use(express.json());

// app.use(cors({
//   origin: function(origin, callback){
//    // allow requests with no origin
//    // (like mobile apps or curl requests)
//    if(!origin) return callback(null, true);
//    if(allowedOrigins.indexOf(origin) === -1){
//      var msg = 'The CORS policy for this site does not ' +
//                'allow access from the specified Origin.';
//      return callback(new Error(msg), false);
//    }
//    return callback(null, true);
//  }

// }));
// const corsOptions = {
//   origin: process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());

app.listen(PORT, () => {
  console.log(
    `Listening on http://${HOST == "0.0.0.0" ? "localhost" : HOST}:${PORT}/`
  );
});

export default app;
