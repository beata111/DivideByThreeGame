var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var usersList = {};

io.on('connection', function (socket) {

  // {
  //   id: own id
  //   o : opponent id
  //   n : initial number
  //   name: name
  //   p: priority
  //  }

  usersList = lookForOpponent(usersList);
  console.log('users list:');
  console.log(usersList);


  socket.on('getCpuName', function () {
    checkOpponentName();
  });

  socket.on('setUserName', function (name) {
    usersList = addNameToList(name, socket.id, usersList);
    socket.broadcast.emit('cpuName', {name: name, id: usersList[socket.id].o});
  });

  socket.on('newInitialNumber', function (number) {
    usersList[socket.id].n = number;
    if (usersList[socket.id].o) {
      usersList[usersList[socket.id].o].n = number;
      socket.broadcast.emit('newInitialNumber', {id: usersList[socket.id].o, number: number});
    }
  });

  socket.on('move', function (move) {
    socket.broadcast.emit('cpuMove', {move: move, id: usersList[socket.id].o});
  });

  socket.on('disconnect', function () {
    console.log('disconnected', socket.id);
    usersList = disconnectUser(usersList);
    console.log('usersList:');
    console.log(usersList);
  });

  function lookForOpponent(usersList) {
    var id = socket.id;
    var newList = Object.assign({}, usersList);
    var joined = false;
    Object.keys(newList).forEach(function (key) {
      if (!joined && !newList[key].o) {
        newList[key].o = id;
        newList[id] = {id: id, n: newList[key].n, o: newList[key].id, p:0};
        socket.emit('cpuConnected', {id: socket.id, number: newList[key].n, priority: newList[socket.id].p});
        socket.broadcast.emit('cpuConnected', {id: key, number: newList[key].n, priority: newList[key].p});
        joined = true;
      }
    });
    if (!newList[id]) {
      newList[id] = {id: id, n: Math.round((Math.random() * 100) + 50), p:1};
    }
    return newList;
  }

  function addNameToList(name, id, usersList) {
    var newList = Object.assign({}, usersList);
    newList[id].name = name;
    checkOpponentName('broadcast');
    return newList;
  }

  function checkOpponentName (broadcast) {
    if (usersList[usersList[socket.id].o]) {
      if (broadcast){
        socket.broadcast.emit('cpuName', {id: socket.id, name: usersList[usersList[socket.id].o].name});
      } else {
        socket.emit('cpuName', {id: socket.id, name: usersList[usersList[socket.id].o].name});
      }
    }
  }

  function disconnectUser (usersList) {
    var id = socket.id;
    var newList = Object.assign({}, usersList);
    Object.keys(newList).forEach(function (key) {
      if (newList[key].o === id) {
        newList[key] = {id: id, n: Math.round((Math.random() * 100) + 50)};
        socket.broadcast.emit('cpuDisconnected', {id: newList[id].o});
      }
    });
    delete newList[id];
    return newList;
  }


});

