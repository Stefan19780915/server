const whiteList = [
  "http://localhost:3500",
  "http://127.0.0.1:5000",
  "https://www.mysite.com",
  "http://192.168.100.6:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
