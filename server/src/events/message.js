const io = require("../io");

module.exports = {
    onConnect: function(socket) {
        socket.on("chatMessage", function(data) {
            const {roomId, message} = data;
    
            io.to(roomId).emit("chatMessage", {username: socket.username, message: message});
        });
    }
}