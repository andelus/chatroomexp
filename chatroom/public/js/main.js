let socket = io.connect();
$(function() {
    let chatApp = new Chat(socket);

    // On First Load
    socket.on('nameResult', function(result) {
        let message;
        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }

        $('.message-board').append(systemContent(message));
    });

    // On room Join
    socket.on('joinResult', function(result) {
        $(".room").text(result.room);
        $('.message-board').append(systemContent("Room Changed"));
    });

    // New Message
    socket.on('message', function(message) {
        let newMessage = $("<div></div>").text(message.text);
        $('.message-board').append(newMessage);
    });

    // Room List
    socket.on('rooms', function(rooms) {
        $(".room-list").empty();

        for (let room in rooms) {
            console.log(room);
            // room = room.substring(1, room.length);
            if (room != '' && room.match(/^[A-z]+$/)) {
                $(".room-list").append(sanitizeMessage(room));
            }
        }

        $(".room-list div").click(function() {
            chatApp.processCommand('/join ' + $(this).text());
            $(".message-input").focus();
        });
    });

    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

    $(".message-input").focus();
    $("#message-form").submit(function(e) {
        e.preventDefault();
        console.log("submited");
        processUserInput(chatApp, socket);
        return false;
    });
});