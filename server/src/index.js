const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);

const uuidv4 = require("uuid").v4;

const gameRooms = {};

// send list of connected users to client
function sendUserList() {
    const userList = [];
    for(key in io.sockets.connected) {
        // should socket id be kept secret?
        userList.push({userId: key, username: io.sockets.connected[key].username});
    }

    io.emit("updateUsers", userList);
}

io.on('connect', function(socket) {
    const cookie = socket.request.headers.cookie;
    const username = cookie && cookie.match(/username=[^;]*/);

    socket.username = username ? username[0].slice(9) : "???";

    sendUserList();
    
    socket.on("updateUsername", function(username) {
        socket.username = username;
        sendUserList();
    });
    
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
            gameRooms[roomId] = {player1Id: socket.id, player2Id: userId};

            user.join(roomId);
            socket.join(roomId);

            user.emit("joinRoom", roomId);
            socket.emit("joinRoom", roomId);
        }
    });
    
    socket.on("challengeUser", function(userId) {
        if(io.sockets.connected[userId] !== undefined) {
            // connectedUsers[userId]
            io.sockets.connected[userId].emit("userChallenged", {userId: socket.id, username: socket.username});
        } else {
            socket.emit("challengeDeclined", "Player is not connected");
        }
    });

    socket.on("chatMessage", function(data) {
        const {roomId, message} = data;

        io.to(roomId).emit("chatMessage", {username: socket.username, message: message});
    });
    
    socket.on("disconnect", function() {
        sendUserList();
    });
});


const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);