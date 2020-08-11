const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);
// const {
//     updateUsers, 
//     challengeUser, 
//     userChallenged
// } = require("./common/event_aliases.js");

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
    socket.username = socket.request.headers.username || "???";
    sendUserList();
    
    
    socket.on("updateUsername", function(username) {
        socket.username = username;
    });
    
    socket.on("declineChallenge", function(userId) {
        const user = io.sockets.connected[userId];
        
        if(user !== undefined) {
            user.emit("challengeDeclined", `${socket.username} is busy`);
        }

        console.log("declineChallenge");
    });
    
    socket.on("acceptChallenge", function(userId) {
        const user = io.sockets.connected[userId];
        
        if(user !== undefined) {
            user.emit("challengeAccepted");
        }
        console.log("acceptChallenge");
    });
    
    socket.on("challengeUser", function(userId) {
        if(io.sockets.connected[userId] !== undefined) {
            // connectedUsers[userId]
            io.sockets.connected[userId].emit("userChallenged", {userId, username: socket.username});
            console.log({userId, username: io.sockets.connected[userId].username})
        } else {
            socket.emit("challengeDeclined", "Player is not connected");
        }
    });
    
    socket.on("disconnect", function() {
        sendUserList();
    });
});


const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);