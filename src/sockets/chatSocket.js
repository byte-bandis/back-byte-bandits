const Chat = require('../models/Chat');

const chatSocket = (io, socket) => {
    console.log("New user connection", socket.id);

    // Unirse a un chat específico
    socket.on("joinChat", async ({ chatId, userId }) => {
      socket.join(chatId); // Unirse a la sala del chat
      console.log(`${userId} se ha unido al chat: ${chatId}`);

      // Marcar todos los mensajes del chat distintos al usuario como leídos
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
      const chat = await Chat.findById(chatId).populate('messages.user');
      
      socket.emit('chatHistory', chat.messages);

      io.to(chatId).emit('messagesRead', userId);
  });

    // Manejar un nuevo mensaje
    socket.on("sendMessage", async ({ chatId, senderId, content }) => {
      const NewMessage = {
        user: senderId,
        content,
      };
      console.log("NewMessage", NewMessage);
      console.log("chatId", chatId);

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
    });

    socket.on('readMessage', async ({ chatId, userId }) => {
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
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  };

module.exports = chatSocket;
