import 'reflect-metadata';
import express from 'express';
import { logger } from './utils/logger';
import * as path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { controllers } from './controllers';
import { AuthorizationService } from '../src/service/auth.service';
import { middlewares } from './middlewares';
import { connect } from './config/db'; // 导入 connect 函数

require('dotenv').config();

useContainer(Container);

// Create Express server
const app: express.Express = express();

const routingControllersOptions: any = {
  routePrefix: '/api/v1',
  defaultErrorHandler: false,
  cors: true,
  authorizationChecker: AuthorizationService.getInstance().authorizationChecker,
  controllers,
  middlewares,
  interceptors: []
};

// Wrap server with routing-controllers
useExpressServer(app, routingControllersOptions);

// Express configuration
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '../public')));

connect();

export { app };
