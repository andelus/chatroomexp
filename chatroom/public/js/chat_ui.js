    // Message Sanitize
    function sanitizeMessage(message) {
        return $("<div></div>").text(message);
    }
    // Trusted html
    function systemContent(message) {
        return $("<div></div>").html('<li>' + message + '</li>');
    }

    let processUserInput = function(chatApp, socket) {
        let message = $(".message-input").val();
        let systemMessage;

        if (message.charAt(0) == "/") {
            systemMessag = chatApp.processCommand(message);
            if (systemMessage) {
                $(".message-board").append(systemContent(systemMessage));
            }
        } else {
            chatApp.sendMessage($(".room").text(), message);
            $(".message-board").append(sanitizeMessage(message));
            $(".message-board").scrollTop($(".message-board").prop('scrollHeight'));
        }
    };