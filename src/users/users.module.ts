import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthService } from './auth/auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
@Module({
  imports:[
    TypeOrmModule.forFeature([
      User
    ]) // create UserRepository for us
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService,

    // CurrentUserInterceptor // (room improvement -> get automatically current user decorator),
    // { // (actual improvement -> get automatically current user decorator) -> So that is how we set up a globally scoped interceptor. -> So now any request that comes in anywhere to our application, not just controllers that are defined by this module, but anywhere inside of application will have this interceptor applied to it.
    //   provide:APP_INTERCEPTOR, // (this is rule to create instance at DI container !!!) The property name of `provide` means if anyone asks for APP_INTERCEPTOR. 
    //   useClass:CurrentUserInterceptor // (this is rule to create instance at DI container !!!) So if anyone asks for APP_INTERCEPTOR, give them the class. CurrentUsersInterceptor.
    // }
  ]
})
export class UsersModule {
  // (more actual improvement -> get automatically current user decorator) -> by using middleware
  // (more actual improvement -> get automatically current user decorator) -> run after cookie session middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}


