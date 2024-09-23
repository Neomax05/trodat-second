import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './modules/config/configs';
// import * as fs from 'fs';

// import { createCA, createCert } from 'mkcert';

// const pathKey = './secrets/create-ca-key.pem';
// const pathCert = './secrets/create-cert-key.pem';

// const httpsOptions = {
//   key: fs.readFileSync(pathKey),
//   cert: fs.readFileSync(pathCert),
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const appConfig = app.get(AppConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.setGlobalPrefix('api');

  await app.listen(appConfig.port, () => {
    console.log('Server was started on port: ' + appConfig.port);
  });
}
bootstrap();
