require("dotenv").config();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const { checkAuthUser } = require("./middleware/authHandler");
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const { connect } = require("http2");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const PORT = process.env.PORT || 3500;

//Connect to MongoDB
connectDB();

//MIDDLEWARE
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cors(corsOptions));
app.use("/", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use("/employee", checkAuthUser, require("./routes/employee"));
app.use("/", require("./routes/user"));
app.delete("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.all("*", (req, res) => {
  res.render("pages/404", {
    msg: "Not Found.",
    body: "",
    user: "",
  });
});
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
});
