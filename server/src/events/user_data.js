const io = require("../io");

function sendUserList() {
    const userList = [];
    for(key in io.sockets.connected) {
        // should socket id be kept secret?
        userList.push({userId: key, username: io.sockets.connected[key].username});
    }

    io.emit("updateUsers", userList);
}

module.exports = {
    onConnect: function(socket) {
        const cookie = socket.request.headers.cookie;
        const username = cookie && cookie.match(/username=[^;]*/);

        socket.username = username ? username[0].slice(9) : "???";

        sendUserList();
        
        socket.on("updateUsername", function(username) {
            socket.username = username;
            sendUserList();
        });
    },
    onDisconnect: function(socket) {
        sendUserList();
    }
};
