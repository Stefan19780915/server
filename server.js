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
const { apiToken } = require('./middleware/apiToken');
const Bree = require('bree');
const moment = require("moment");

//const { job1 } = require("./jobs/birthDayEmail");


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
app.locals.moment = moment;


//ROUTES
app.use("/", require("./routes/user"));
app.use("/employee", apiToken, checkAuthUser, require("./routes/employee"));
app.use("/chat", checkAuthUser, require("./routes/chat"));
app.use("/pdf", checkAuthUser, require("./routes/pdf"));
app.use("/store", checkAuthUser, require("./routes/store"));




//JUST TO TEST A REQUEST - ALSO FROM TERMINAL WITH CURL -  curl http://localhost:3500/test/typeAnyWordHere
app.get('/test/:word', (req, res)=>{
  if(!req.params.word){
    res.status(400).json({ error: 'Invalid input' });
  }
  //SEND AS JSON
  res.json({ response: `This is the JSON request parameter content: ${req.params.word}` });
  //SEND AS TEXT
  //res.send(`This is the reqest parameter passed ${req.params.word}`);
})


//job1();

//RUN A SCHEDULER JOB
// + 2 hours because of time zone for render.com server 9 o clock is 11 o clock in US

const bree = new Bree({
    jobs: [
        {
            name: 'birthDayEmail',
            cron : '30 8 * * *'
        },
        {
          name: 'seniorityEmail',
          cron : '0 0 * * 0'
        },
        {
          name: 'unitShiftsHoursEmail',
          cron : '45 8 * * *'
        }
    ]
});
bree.start();



app.all("*", (req, res) => {
  res.render("pages/404", {
    msg: "Not Found.",
    body: "",
    user: "",
    message: req.flash("message"),
  });
});
app.use(errorHandler);

console.log('Server time zone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('Server local time:', new Date().toString());

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
});
