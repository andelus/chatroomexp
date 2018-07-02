let socketHelpers = (function () {
  "use strict";
  let guestNumber,
    currentRoom,
    nickNames,
    namesUsed;
  guestNumber = 1;
  currentRoom = {};
  nickNames = {};
  namesUsed = [];
  // Assign guest name on connect
  let assignGuestName = (socket) => {
    let name = "Guest " + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
      success: true,
      name: name
    });
    namesUsed.push(name);
    return name;
  };
  // Join Room
  let joinRoom = (io, socket, room) => {
    // Join Room
    socket.join(room);
    // Keep user in that room
    currentRoom[socket.id] = room;
    // Feedback to user
    socket.emit('joinResult', {room: room});
    // Broadcast to other users
    socket
      .broadcast
      .to(room)
      .emit('message', {
        text: nickNames[socket.id] + ' has joined' + room
      });

    // Get users in that room
    let connectedUsers = io
      .of('/')
      . in(room)
      .clients;
    if (connectedUsers.length > 1) {
      let usersSummary = 'Users Currently in ' + room + ' are:'
      for (let index in connectedUsers) {
        let userSocketId = connectedUsers[index].id;
        if (userSocketId != socket.id) {
          if (index > 0) {
            usersSummary += ', ';
          }
          usersSummary += nickNames[userSocketId];
        }
      }
      usersSummary += '.';
      socket.emit('message', {text: usersSummary});
    }
  };
  // Change username
  let changeNameAttempt = (socket) => {
    socket
      .on('changeNameAttempt', function (name) {
        // Name validation
        if (name.indexOf("Guest") === 0) {
          socket.emit('nameResult', {
            success: false,
            message: 'Name cannot begin with "Guest"'
          });
        } else {
          if (namesUsed.indexOf(name) === -1) {
            // Get current name
            var previousName = nickNames[socket.id];
            // Get current name index
            var previousNameIndex = namesUsed.indexOf(previousName);
            // Add new name to used names
            namesUsed.push(name);
            // Affect the new name
            nickNames[socket.id] = name;
            // Delete previous name
            delete namesUsed[previousNameIndex];
            // Emit success for name change
            socket.emit('nameResult', {
              success: true,
              name: name
            });
            // Tell everybody else
            socket
              .broadcast
              .to(currentRoom[socket.id])
              .emit('message', {
                text: previousName + 'is now known as ' + name
              });

          } else {
            socket.emit('nameResult', {
              success: false,
              message: 'Name already in use.'
            });
          }
        }
      });
  };

  // Braodcast Messages
  let broadcastMessages = (socket) => {
    socket
      .on('message', function (message) {
        console.log("message", message);
        socket
          .broadcast
          .to(message.room)
          .emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
          });
      });
  };
  // Handle room creation
  let createRoom = (io, socket) => {
    socket
      .on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(io, socket, room.newRoom);
      });
  };
  // Handle Logout
  let logout = (socket) => {
    socket
      .on('disconnect', function () {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
      });
  }

  let factory = {
    assignGuestName: assignGuestName,
    joinRoom: joinRoom,
    broadcastMessages: broadcastMessages,
    changeNameAttempt: changeNameAttempt,
    createRoom: createRoom,
    logout: logout
  };
  return factory;

})();

module.exports = socketHelpers;
