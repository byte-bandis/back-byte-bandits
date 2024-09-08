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

        // Enviar el historial de mensajes del chat
        const updatedChat = await Chat.findById(chatId).populate('messages.user');
        
        socket.emit('chatHistory', updatedChat.messages);

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

    // Manejar la conexión del usuario
    socket.on("connectUser", async () => {
        socket.join(socket.user._id);
        console.log("User connected", socket.user._id);
    });

    // Manejar la desconexión del usuario
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  };

module.exports = chatSocket;
