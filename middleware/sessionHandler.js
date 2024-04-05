require("dotenv").config();
const session = require("express-session");
const MemoryStore = require('memorystore')(session);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
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
