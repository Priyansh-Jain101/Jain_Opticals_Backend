require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// require the router objects
const opticalRoutes = require("./routes/Optical.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Connection Failed", err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

// routes middleware
app.use("/jain_opticals", opticalRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
