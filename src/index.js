import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import nodemailerRouter from "./routes/nodemailerRouter";
import socketIo from "socket.io";
import http from "http";
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adsRoutes = require("./routes/adsRoutes");
const likeRouter = require("./routes/likesRouter");
const commentsRoutes = require("./routes/commentsRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const chatRouter = require("./routes/chatRoutes");
const middlewares = require("./middleware/middlewares");
const Chat = require("./models/Chat");
const i18n = require("./lib/i18nConfigure");

const swaggerUi = require("swagger-ui-express");
let swaggerDocument;

if (process.env.NODE_ENV !== "production") {
  try {
    swaggerDocument = require("./swagger.json");
  } catch (error) {
    console.error("Error loading swagger.json:", error.message);
  }
}

const ErrorResponse = require("./middleware/ErrorResponse");

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server);

  await mongoose.connect(process.env.MONGO_URI);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("public"));
  

  app.use(i18n.init);

  app.get("/", (req, res) => {
    res.json({
      message: "Hello World",
    });
  });
  app.get("/public/images/:image", (req, res) => {
    const image = req.params.image;
    res.sendFile(`${__dirname}/public/images/${image}`);
  });
  app.get("/public/images/profiles/:image", (req, res) => {
    const image = req.params.image;
    res.sendFile(`${__dirname}/public/images/profiles/${image}`);
  });

  if (process.env.NODE_ENV !== "production" && swaggerDocument) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
  app.use(ErrorResponse);
  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);
  app.use("/ads", adsRoutes);
  app.use("/comments", commentsRoutes);
  app.use("/likes", likeRouter);
  app.use("/nodemailer", nodemailerRouter);
  app.use("/transactions", transactionRoutes);
  app.use("/chat", chatRouter);

  io.on("connection", (socket) => {
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
  });

  server.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
};

startServer();
