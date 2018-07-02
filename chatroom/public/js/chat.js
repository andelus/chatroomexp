var Chat = function(socket) {
    this.socket = socket;
};

// Send Message
Chat.prototype.sendMessage = function(room, text) {
    let message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

// Change room
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

// Process Command
Chat.prototype.processCommand = function(cmd) {
    let words = cmd.split(' '); // ['/nick', 'value']
    cmd = words[0].substring(1, words[0].length).toLowerCase(); // 'nick'
    let message = false;

    // Assert Commands
    switch (cmd) {
        case 'join':
            words.shift();
            let room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            let name = words.join(' ');
            this.socket.emit('changeNameAttempt', name);
            break;
        default:
            message = 'Unrecognized Command';
            break;

    }
    return message;
};