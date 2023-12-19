const fsPromises = require("fs").promises;
const fs = require("fs");

if (!fs.existsSync("./new")) {
  fsPromises.mkdir("./new");
}

if (fs.existsSync("./new")) {
  fsPromises.rmdir("./new");
}
