const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);

io.on('connect', socket => {
    console.log("a user connected");

    socket.on("disconnect", socket => {
        console.log("a user disconnected");
    });
});

const port = process.env.PORT || 5000;

server.listen(process.env.PORT || 5000);
console.log(`listening on port ${port}`);