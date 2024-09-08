const chatSocket = require('./chatSocket');
const jwt = require('jsonwebtoken');

const initializeSockets = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.query.token;

        if (!token) {
            return next(new Error('Unauthorized. Token not available.'));
        }
        
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decode.user;
            next();
        } catch (error) {
            return next(new Error('Unauthorized. Error while verifying the token'));
        }
    });

  io.on('connection', (socket) => {
    chatSocket(io, socket); // Initialize chat socket
  });
};

module.exports = initializeSockets;