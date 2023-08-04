require("dotenv").config();
const path = require("path");
const http = require("http");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logEvents");
const { checkAuthUser } = require("./middleware/authHandler");
const errorHandler = require("./middleware/errorHandler");
const { sessionMiddleware, wrap } = require("./middleware/sessionHandler");
const express = require("express");
const socketio = require("socket.io");
const chatController = require("./controllers/chatController");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const { connect } = require("http2");
const flash = require("express-flash");
const passport = require("passport");
const PORT = process.env.PORT || 3500;

//Start Chat
io.sockets.on("connection", chatController.chat);

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
app.use(sessionMiddleware);
io.use(wrap(sessionMiddleware));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use("/", require("./routes/user"));
app.use("/employee", checkAuthUser, require("./routes/employee"));
app.use("/chat", checkAuthUser, require("./routes/chat"));
app.use("/pdf", checkAuthUser, require("./routes/pdf"));
app.use("/store", checkAuthUser, require("./routes/store"));

app.all("*", (req, res) => {
  res.render("pages/404", {
    msg: "Not Found.",
    body: "",
    user: "",
    message: req.flash("message"),
  });
});
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
});
