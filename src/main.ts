import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // (refactor for testing e2e test)
  //   app.use(cookieSession({
  //     keys:['random'] // (setting up cookie) -> this array string -> string can be random number and letter -> this string is gonna be use for encrypting the information inside the key -> for encryption step 
  //   }))

  // (refactor for testing e2e test)
  // app.useGlobalPipes(
  //   new ValidationPipe(
  //     {
  //       whitelist: true // by setting whitelist : true -> its gonna make sure any additional property that sent along from request will be stripped out automatically
  //       // ex: 
  //       // {
  //       //     "email":"santosa.thomas94@gmail.com",
  //       //     "password":"123"
  //       //     "asdf" : 123 -- additional property will be stripped out by setting whitelist : true
  //       // }
  //     }
  //   )
  //   )
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
