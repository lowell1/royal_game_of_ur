const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);
const {
    updateUsers, 
    challengeUser, 
    challengeResponse
} = require("./common/event_aliases.js");

// send list of connected users to client
function sendUserList() {
    const userList = [];
    for(key in io.sockets.connected) {
        // should socket id be kept secret?
        userList.push({userId: key, username: io.sockets.connected[key].username});
    }
    console.log(userList);
    io.emit(updateUsers, userList);
}

io.on('connect', function(socket) {
    socket.username = socket.request.headers.username || "???";
    sendUserList();
    
    socket.on("disconnect", function() {
        sendUserList();
    });
    
    // socket.on(challengeUser, function(userId) {
    //     if(connectedUsers[userId]) {
    //         connectedUsers[userId].
    //     } else {
    //         socket.emit(challengeResponse, false);
    //     }
    // });
});


const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);