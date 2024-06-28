const ws = new WebSocket("ws://localhost:3000"); // Set Server IP and port number
const chatLog = document.getElementById("chatLog");
const messageBox = document.getElementById("messageBox");
const sendButton = document.getElementById("btn-message");

document.addEventListener("DOMContentLoaded", function () {
  const savedChatLogLocal = localStorage.getItem("chatLog");
  const savedChatLogSession = sessionStorage.getItem("sessionChatLog");

  if (savedChatLogLocal) {
    chatLog.value = savedChatLogLocal;
  }

  if (savedChatLogSession) {
    chatLog.value += "\nSession Messages:\n" + savedChatLogSession;
  }
});

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const timeStamp = new Date(data.timeStamp).toLocaleTimeString();
  const message = `${timeStamp} ${data.id}: ${data.message}\n`;

  // Update chat log
  chatLog.value += message; // Add ID and Message to textarea

  // Save chat log to Local Storage
  localStorage.setItem("chatLog", chatLog.value); // Save chat log to local storage

  // Save only the current message to Session Storage
  let sessionMessages = sessionStorage.getItem("sessionChatLog") || "";
  sessionMessages += message;
  sessionStorage.setItem("sessionChatLog", sessionMessages);
};

sendButton.onclick = function () {
  if (messageBox.value.trim().length > 0) {
    const message = JSON.stringify({ text: messageBox.value });
    ws.send(message); // Send message object to server
    messageBox.value = ""; // Initialize inputbox
  }
};
