const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();
//join chatroom
socket.emit("joinRoom", { room: "FAQ" });

//Message from serveer
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm,
  addEventListener("submit", (e) => {
    if ((e.target = "chat-submit")) {
      e.preventDefault();
      const msg = e.target.elements.msg.value;
      socket.emit("chatMessage", msg);
      e.target.elements.msg.value = "";
      e.target.elements.msg.value.focus();
    }
  });

//Output message to DOM

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}
