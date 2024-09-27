const socket = io("https://chat-websocket-kohl.vercel.app/");

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
function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
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

socket.on("feedback", (data) => {
  addFeedback(data);
});

function addFeedback(data) {
  clearFeedback();
  const element = `<li class="message-feedback">
                <p class="feedback" id="feedback"> ${data.feedback}</p>
                </li>`;
  messageContainer.innerHTML += element;
}

function addMessageUI(isOwnMessage, data) {
  clearFeedback();
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
