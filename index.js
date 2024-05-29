const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
const router = require("./routes/router");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const generateTestSpots = require("./controllers/spotController");

// Connection URL
const dburl =
  "mongodb+srv://noahjhurley:EO7nCAcksdwlSU2U@teststokeddb.nrdifyx.mongodb.net/?retryWrites=true&w=majority&appName=TestStokedDB";

// Database Name
const dbName = "stoked_db";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(dburl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
});

// Middleware to attach db to request
app.use((req, res, next) => {
  client
    .connect()
    .then(() => {
      req.db = client.db(dbName);
      console.log("Connected to MongoDB");
      generateTestSpots();
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
