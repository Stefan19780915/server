require("dotenv").config();
const session = require("express-session");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

const wrap = function (expressMiddleWare) {
  return function (socket, next) {
    expressMiddleWare(socket.request, {}, next);
  };
};

module.exports = {
  sessionMiddleware,
  wrap,
};
