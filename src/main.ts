import * as http from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const httpServer = http.createServer(server);
  const ioAdapter = new IoAdapter(httpServer);

  app.useWebSocketAdapter(ioAdapter);

  await app.init();
  httpServer.listen(process.env.PORT, () => {
    Logger.log(`'Listening at http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
