var path = require('path');

var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();

var socketio = require('socket.io');

server.on('request', app);

var io = socketio(server);

var DataStore = [];

server.listen(1337, function () {
  console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

app.get('*', function (req, res) {
  console.log(req.url)
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function (socket) {
  console.log('client connected');
  console.log(socket.id);

  socket.emit('load', DataStore);

  socket.on('draw', function (start, end, color) {
    DataStore.push({ start, end, color });
    socket.broadcast.emit('draw', start, end, color);
  });

  socket.on('disconnect', function () {
    console.log('Goodbye, ', socket.id, ' :(');
  });
});

