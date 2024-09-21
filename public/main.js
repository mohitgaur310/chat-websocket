const socket = io();

const clientsTotal = document.getElementById("client-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

socket.on("total_client", (data) => {
  clientsTotal.innerText = `Total Clients :${data}`;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  console.log("🚀 ~ data:", data);
  addMessageUI(false, data);
});

function addMessageUI(isOwnMessage, data) {
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
                        <p class="message">
                           ${data.message}
                            <span> ${data.name}*${moment(
    data.dateTime
  ).fromNow()}</span>
                        </p>
                    </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
