import express from "express";
import app from "./app.js";
import api from "./api/index.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Middleware to parse JSON requests
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
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api", api);

// 404 route - handle unknown routes
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});
