import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import {
  ConfigModule, // the config module is what we're going to use to specify which of these two different files .env.test or .env.development we actually want to read.
  ConfigService  // The config service is what is going to expose the information inside those files to the rest of our application.
} from '@nestjs/config';
const cookieSession = require('cookie-session')
const dbConfig = require('../ormconfig.js')
// we gonna create any connection database in AppModule 
// why ? it is going automatically share down to UserModule and ReportsModule in other word when we start up AppModule this single connection database => it is going to share and spread to other module
// then inside UserModule and ReportsModuler we are going to have separate file we refer as entity file -> very similiar like model
// then once creating this entity file, we gonna feed them to the nest and behind the scene nest and type orm are gonna work together to create reporsitoty UsersRepositoty and ReportsRepositoty for us 
// most important : when we are using TypeORM, we don't have to create repository file manually like in the section before instead this repository gonna create for us automatically behind the scene, also we don't end up to `nest generate ...` like that
// UsersRepository and ReportsRepostiory are 2 file we aren't gonna manually create instead automatic


@Module({
  imports: [
    ConfigModule.forRoot({
      // applying .env globally
      isGlobal: true, // this setting right here just means that we do not have to reimport the config module all over the place into other modules inside of a project whenever we want to get some config information.
      envFilePath: `.env.${process.env.NODE_ENV}` // Then as a second property, we're going to put in exactly which these two files we want to use.
    }),
    // (more refactor for test purpose)
    // TypeOrmModule.forRootAsync({
    //   // (inject) -> I'm then going to inject the config service so that right there, that's the magic part, that's what
    //   // (inject) -> tells the dependency injection system that we want to go and find the configuration service, which
    //   // (inject) -> should have all of our config info inside of it from our chosen file.
    //   // (inject) -> And we want to get access to that instance of the config service during the setup of our type or a module.
    //   inject: [ConfigService],

    //   // Then as a second argument or second property, instead of here, we're going to put in useFactory.
    //   // This is going to be a function that is going to receive our instance of the ConfigService.
    //   useFactory: (config: ConfigService) => {
    //     // So this is the dependency injection part.
    //     // This is where we are going to get our copy or the instance of the ConfigService that, again, should
    //     // have all the information from our ENV file inside of it.
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report], // list out of entities inside app ex: UserEntity, ReportEntity,
    //       synchronize: true // synchronize is used to migration where might change/modify database structure from typeorm -> this synchronize : true (for development purpose)-> will lookup entity and then automatically update the structure of database -> it is going to add/remove column or add/remove rows
    //     }
    //   }

    // }),

    // (setting up the db connection based on env file)
    //   TypeOrmModule.forRoot({
    //   type:'sqlite',
    //   // database: 'db.sqlite',
    //   // (refactor for test purpose)
    //   database: (process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite'),
    //   entities: [User, Report], // list out of entities inside app ex: UserEntity, ReportEntity,
    //   synchronize: true // synchronize is used to migration where might change/modify database structure from typeorm -> this synchronize : true (for development purpose)-> will lookup entity and then automatically update the structure of database -> it is going to add/remove column or add/remove rows
    // }), // setup db connection for us and sharing the connection to other module

    // (more setting up the db connection based on env file)
    TypeOrmModule.forRoot(
      dbConfig
    ),

    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(
        {
          whitelist: true // by setting whitelist : true -> its gonna make sure any additional property that sent along from request will be stripped out automatically
          // ex: 
          // {
          //     "email":"santosa.thomas94@gmail.com",
          //     "password":"123"
          //     "asdf" : 123 -- additional property will be stripped out by setting whitelist : true
          // }
        })
    }
  ],
})

// What order running class in Nest ?
// 1. Run request
// 2. Run middleware / pipe
// 3. Run guard
// 4. Run interceptor before request/route handler
// 5. Run request/route handler
// 6. Run interceptor after request/route handler
// 7. Run response

export class AppModule {
  // access to dotenv
  constructor(
    private configService: ConfigService
  ) {}

  // global middleware / pipe
  configure(consumer: MiddlewareConsumer) {
    // so this configure function is going to be called automatically whenever our application start listing for incoming traffic.
    // So instead of here, we can set up some middleware that will run on every single incoming request.

    consumer.apply(
      cookieSession({
        // keys: ['random'] // (setting up cookie) -> this array string -> string can be random number and letter -> this string is gonna be use for encrypting the information inside the key -> for encryption step 
        keys: [this.configService.get('COOKIE_KEY')]// ('deploy to production')
      })
    ).forRoutes('*') // So that means that we want to make use of this middleware on every single incoming request that flows into our entire application. -> That means it's essentially a global middleware.
  }
}
