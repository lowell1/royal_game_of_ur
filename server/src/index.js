const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);
const {updateUsers} = require("./common/event_aliases.js");

// socket objects of connected users
const connectedUsers = {};

io.on('connect', function(socket) {
    // add user to connectedUsers
    const username = socket.request.headers.username || "???";
    // should socket id be kept secret?
    connectedUsers[socket.id] = {userId: socket.id, username: username};

    io.emit(updateUsers, Object.values(connectedUsers));
    
    socket.on("disconnect", function() {
        delete connectedUsers[socket.id];
        io.emit(updateUsers, Object.values(connectedUsers));
    });
});

const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);