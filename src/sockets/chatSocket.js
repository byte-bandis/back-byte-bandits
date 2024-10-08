const Chat = require('../models/Chat');
const validateChatAndUser = require('./utils/validateChatAndUser');

const chatSocket = (io, socket) => {
    console.log("New user connection", socket.id);

    // Unirse a un chat específico
    socket.on("joinChat", async ({chatId}) => {
        const userId = socket.user._id;
        const {error} = await validateChatAndUser(chatId, userId);

        if(error) {
            return socket.emit('error', error);
        }

        socket.join(chatId); // Unirse a la sala del chat
        console.log(`${userId} se ha unido al chat: ${chatId}`);

        // Marcar mensajes del chat distintos al usuario como leídos
        await Chat.findByIdAndUpdate(chatId, {
            $set: {
                "messages.$[msg].read": true
            }
        }, {
            arrayFilters: [
                { "msg.read": false , "msg.user": { $ne: userId } }
            ],
            new: true
        });

        io.to(chatId).emit('messagesRead', userId);
        io.to(userId).emit('userMessagesRead', userId);
  });

    // Manejar un nuevo mensaje
    socket.on("sendMessage", async ({ chatId, content }) => {
        const userId = socket.user._id;
        const {error} = await validateChatAndUser(chatId, userId);

        if(error) {
            return socket.emit('error', error);
        }

        const NewMessage = {
            user: userId,
            content,
        };

      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            messages: NewMessage,
          },
        },
        { new: true }
      ).populate("messages.user");

      const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

      // Emitir el mensaje a la sala del chat
      io.to(chatId).emit("newMessage", lastMessage);
      io.to(updatedChat.buyer._id.toString()).emit("userNewMessage", lastMessage);
      io.to(updatedChat.seller._id.toString()).emit("userNewMessage", lastMessage);
    });

    // Manejar la lectura de mensajes
    socket.on('readMessage', async ({ chatId }) => {
        const userId = socket.user._id;
        const {error} = await validateChatAndUser(chatId, userId);

        if(error) {
            return socket.emit('error', error);
        }

        // Marcar mensajes del chat distintos al usuario como leídos
        await Chat.findByIdAndUpdate(chatId, {
            $set: {
                "messages.$[msg].read": true
            }
        }, {
            arrayFilters: [
                { "msg.read": false , "msg.user": { $ne: userId } }
            ],
            new: true
        });

        io.to(chatId).emit('messagesRead', userId);
        io.to(userId).emit('userMessagesRead', userId);
    });

    // Manejar cierre de sala de chat
    socket.on("leaveChat", async ({ chatId }) => {
        const userId = socket.user._id;
        const {error} = await validateChatAndUser(chatId, userId);

        if(error) {
            return socket.emit('error', error);
        }

        socket.leave(chatId);
        console.log(`${userId} ha dejado el chat: ${chatId}`);
    }
    );

    // Manejar la conexión del usuario
    socket.on("connectUser", async () => {
        const userId = socket.user._id;
        socket.join(userId);
        console.log("User connected", userId);
    });

    // Manejar la desconexión del usuario
    socket.on("disconnectUser", async () => {
        const userId = socket.user._id;
        socket.leave(userId);
        console.log("User disconnected", userId);
    });

    // Manejar la desconexión del usuario
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });

    // Se ejecuta cuando la reconexión falla
    socket.on('reconnect_failed', () => {
        console.log('Fallo en la reconexión');
    });
  
    // Se ejecuta en cada intento de reconexión
    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Intento de reconexión #${attemptNumber}`);
    });
  
    // Se ejecuta cuando la reconexión tiene éxito
    socket.on('reconnect', (attemptNumber) => {
        console.log(`Reconectado con éxito después de ${attemptNumber} intento(s)`);
    });
  };

module.exports = chatSocket;
