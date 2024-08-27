import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adsRoutes = require("./routes/adsRoutes");
const likeRouter = require("./routes/likesRouter");
const commentsRoutes = require("./routes/commentsRoutes");
const middlewares = require("./middleware/middlewares");
const customErrorHandler = require("./middleware/CustomErrorsHandler");

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

  await mongoose.connect(process.env.MONGO_URI);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("public"));

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
  //app.use(ErrorResponse);
  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);
  app.use("/ads", adsRoutes);
  app.use("/comments", commentsRoutes);
  app.use("/likes", likeRouter);

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}`)
  );

  app.use(customErrorHandler);
  /*   app.use(middlewares.notFound);
  app.use(middlewares.errorHandler); */
};

startServer();
