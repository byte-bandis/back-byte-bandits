import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adsRoutes = require('./routes/adsRoutes');
const likeRouter = require('./routes/likesRouter');
const commentsRoutes = require('./routes/commentsRoutes');
const middlewares = require('./middleware/middlewares');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const ErrorResponse = require('./middleware/ErrorResponse');

dotenv.config();

const port = process.env.PORT || 4000;
const startServer = async () => {
  const app = express();

  require('./utils/connectMogoose');

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(ErrorResponse);
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
  app.use('/ads', adsRoutes);
  app.use('/comments', commentsRoutes);
  app.use('/likes', likeRouter);

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}`)
  );

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
};

startServer();
