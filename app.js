const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cron = require("node-cron");
const morgan = require("morgan");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");
const dbURI = process.env.DB_URI;
const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function (result) {
    console.log("App is running at Port " + port);
    app.listen(port);
  })
  .catch((err) => console.log(err));

app.use("/panel", adminRoutes);
app.use("/api", apiRoutes);
app.use("/", userRoutes);

app.use((req, res) => {
  res.redirect("/");
});
