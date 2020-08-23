const server = require('http').createServer();
const options = {
    // disable compression of data payloads
    perMessageDeflate: false
};
const io = require('socket.io')(server, options);

const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);

module.exports = io;