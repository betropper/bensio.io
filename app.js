
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/',express.static(__dirname + '/'));
http.listen(8080);

//Server stuff.

var S = {
  testnumber: 0,
  online: 0,
  bgs: ['stars','west','sunset'],
  currentbg: 'stars'
}

var io = require('socket.io')(http,{});

io.sockets.on('connection', function(socket) {
  console.log('A player has connected.');
  S.online++
  socket.emit('firstMessage', {
    number: S.testnumber,
    online: S.online,
    bg: S.currentbg
  });
  socket.on('bet', function(data) {
    console.log(data.player + ' has placed a bet.');
    S.testnumber++
    io.sockets.emit('numberChanged', S.testnumber);
  });
  socket.on('disconnect', function() {
    S.online--
  });
});

var changeRound = function() {
  var newbg = S.bgs[Math.floor(Math.random() * S.bgs.length)];
  io.emit('newRound',{
    bg: newbg
  });
}

setInterval(changeRound, 1000);