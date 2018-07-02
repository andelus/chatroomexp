let socketio = require("socket.io");
let socketHelpers = require("./Helpers");
let chatModule = (function () {
  "use strict";
  let io,
    guestNumber;

  let listen = (server) => {
    // Initiate listening on the server
    io = socketio.listen(server);
    io.set('log level', 1);

    //On Connection
    io.on('connection', function (socket) {
      // Guestnumber
      guestNumber = socketHelpers.assignGuestName(socket);
      // Join Room
      socketHelpers.joinRoom(io, socket, 'Arena');
      //Broadcasting Messages
      socketHelpers.broadcastMessages(socket);
      //Name Change Request
      socketHelpers.changeNameAttempt(socket);
      // Room Creation
      socketHelpers.createRoom(io, socket);
      //List Rooms
      socket.on('rooms', function () {
        socket.emit('rooms', io.sockets.adapter.rooms);
      });

      //Logout user
      socketHelpers.logout(socket);
    });
  };

  return {listen: listen}
})();

exports.listen = chatModule.listen;
