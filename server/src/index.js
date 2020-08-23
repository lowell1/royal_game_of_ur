const io = require("./io");
const userDataEvents = require("./events/user_data");
const challengeEvents = require("./events/challenge");
const messageEvents = require("./events/message");

io.on('connect', function(socket) {
    userDataEvents.onConnect(socket);
    messageEvents.onConnect(socket);
    challengeEvents.onConnect(socket);
    
    socket.on("disconnect", function() {
        userDataEvents.onDisconnect(socket);
    });
});

