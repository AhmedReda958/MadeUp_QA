import express from "express";
import app from "./app.js";
import api from "./api/index.js";

// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api", api);

// 404 route - handle unknown routes
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});
