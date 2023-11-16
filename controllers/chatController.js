const moment = require("moment");
const chatAdmin = "Admin";

//RENDER READ CHAT PAGE
const chatWiev = async (req, res) => {
  res.render("../views/pages/chat", {
    msg: false,
    user: req.user,
    message: req.flash("message"),
  });
};

//CHAT FUNCTION FOR SOCKETIO
const chat = function (socket) {
  if (socket.request.session.passport != undefined) {
    const user = socket.request.session.passport.user;
    socket.on("joinRoom", ({ room }) => {
      room =
        (!user.admin && user.roles == "User") ||
        (!user.admin && user.roles == "Owner")
          ? "public"
          : !user.admin
          ? user._id
          : user.admin;
      user["room"] = room;
      socket.join(user.room);

      //Welcome message
      socket.emit(
        "message",
        formatMessage(
          chatAdmin,
          `Welcome to the chat. Here you can ask questions and talk to other users of the app.`
        )
      );
      //Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(chatAdmin, `${user.userName} has joined the chat.`)
        );
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      socket.to(user.room).emit("message", formatMessage(user.userName, msg));
      socket.emit("message", formatMessage(user.userName, msg));
    });

    //Runs when client disconnects
    socket.on("disconnect", () => {
      socket.broadcast.emit(
        "message",
        formatMessage(chatAdmin, `${user.userName} has left the chat.`)
      );
    });
  }
};

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm: a"),
  };
}

module.exports = { chatWiev, chat };