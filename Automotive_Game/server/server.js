// server.js
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // directory that including HTML, CSS, JS files

wss.on('connection', function connection(ws) {
    // Assign unique ID per each connection
    const clientId = Date.now();
  
    // Handle a message that recieved from client
    ws.on('message', function incoming(data) {
      const message = JSON.parse(data);
      const broadcastData = JSON.stringify({ id: clientId, message: message.text });
      
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastData);
        }
      });
    });
  
    // Send connection notice message to all of clients
    const welcomeMessage = JSON.stringify({ id: clientId, message: `${clientId} is connected.` });
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(welcomeMessage);
      }
    });
  });

server.listen(3000, function listening() {
  console.log('Server starts on the 3000 port.');
});
  


  
