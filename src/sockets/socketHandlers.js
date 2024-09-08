const chatSocket = require('./chatSocket');

const initializeSockets = (io) => {
  io.on('connection', (socket) => {
    chatSocket(io, socket); // Initialize chat socket
  });
};

module.exports = initializeSockets;