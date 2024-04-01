const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
const router = require("./routes/router");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

// Connection URL
const dburl = "mongodb://localhost:27017/stoked_db";

// Database Name
const dbName = "stoked_db";

// Create a new MongoClient
const client = new MongoClient(dburl);

// Middleware to attach db to request
app.use((req, res, next) => {
  client
    .connect()
    .then(() => {
      req.db = client.db(dbName);
      next();
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
      next(err);
    });
});

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
