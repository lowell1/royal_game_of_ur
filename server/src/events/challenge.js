const io = require("../io");
const uuidv4 = require("uuid").v4;

module.exports = {
    onConnect: function(socket) {
        socket.on("declineChallenge", function(userId) {
            const user = io.sockets.connected[userId];
            
            if(user !== undefined) {
                user.emit("challengeDeclined", `${socket.username} is busy`);
            }
        });
        
        socket.on("acceptChallenge", function(userId) {
            const user = io.sockets.connected[userId];
            
            if(user !== undefined) {
                const roomId = uuidv4();
    
                user.join(roomId);
                socket.join(roomId);
    
                user.emit("joinRoom", roomId);
                socket.emit("joinRoom", roomId);
            }
        });
        
        socket.on("challengeUser", function(userId) {
            if(io.sockets.connected[userId] !== undefined) {
                io.sockets.connected[userId].emit("userChallenged", {userId: socket.id, username: socket.username});
            } else {
                socket.emit("challengeDeclined", "Player is not connected");
            }
        });
    }
}