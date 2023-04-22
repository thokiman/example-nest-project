// option 1 -> not flexible (nest interceptor)
// import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
// option 2 -> flexible (custom interceptor)

import { Session, // (setting up cookie) -> setting up cookie-session libs with nest route handler
    Body, 
    Controller, 
    Delete, 
    Get, 
    NotFoundException, 
    Param, 
    Patch,
    Post, 
    Query,
    // UseInterceptors // (room improvement -> get automatically current user decorator),
    UseGuards 
    } from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dtos/update-user.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth/auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor' // (room improvement -> get automatically current user decorator)
import { User } from './users.entity'
import { AuthGuard } from '../guards/auth.guard'
// Another common auth systems features
// 1. reject requests to certain handler if the user is not signed in -> guard
// 2. automatically tell a handler who the currently signed in user is -> interceptor + decorator


@Controller('auth')
@Serialize(UserDto) // (more refactor) -> not just only one request handler findUser, but all handler inside this controller -> it is going to intercept all outgoing responses from all the request/route handler inside the controller and it is gonna be formatted  all the user getting returned each them
// @UseInterceptors(CurrentUserInterceptor) // (room improvement -> get automatically current user decorator) 
export class UsersController {

    constructor (
        private usersService: UsersService, 
        private authService: AuthService
    ) {}
    
    @Get('/colors/:color')
    setColor(
        @Param('color') color:string,
        @Session() session:any
    ) {
        console.log('\nTest cookie')
        console.log('setColor -> input color : ', color)
        session.color=color;
        console.log('setColor -> current session.color : ', session.color)
    }
    @Get('/colors')
    getColor(
        @Session() session:any
    ) {
        console.log('\nTest cookie')
        console.log('getColor -> current session.color : ', session.color)
        return session.color
    }

    
    @Get('/whoami')
    @UseGuards(AuthGuard) // This is a decorator that allows us to say run some guard before sending a request off either to the entire controller or to a particular handler.
    // ^ And that should be it now, if a user is not signed in, they won't be able to access whoAmI route handler
    // and we're going to send them back automatically, a response with a status up for 403, which means `sorry, but you can access this route.`
    // Otherwise, if they are signed in, then we're going to allow them access to the route and we're going to send back the user that they are currently sign in as.
    whoAmI(
        @CurrentUser() user:User
        // ^ get automatically current user decorator
    ) {
        return user
    }

    // @Get('/whoami') // do session persisting user sign in after do signup or signin route handler
    // whoAmI(
    //     @Session() session:any
    // ) {
    //     // this.usersService.findOne(null) // instead of null value that will be returned, it will return first user because we put null value and typeorm read as find first user
    //     return this.usersService.findOne(session.userId)
    // }


    @Post('/signout')
    signout(
        @Session() session:any
    ) {
        session.userId = null
    }

    // use auth to sign up
    // new pass from auth : 4edb1087e4e2c332.d3a5dc4305fcfa4b0c3f993e437729981f33e9606dfbd10da5d5250cb4825688
    //                      ^ salt          .       ^sHash = hash(originalpass+salt)
    @Post('/signup')
    async createUser(
        @Body() body: CreateUserDto,
        @Session() session:any
    ) {
        // return this.authService.signup(body.email, body.password)
        
        // setting up with session for deciding whether or not the user sign in on follow up request
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signin(
        @Body() body: CreateUserDto,
        @Session() session:any
    ) {
        // return this.authService.signin(body.email, body.password)
        
        // setting up with session for deciding whether or not the user sign in on follow up request
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    // @Post('/signup')
    // createUser(
    //     @Body() body: CreateUserDto
    // ) {
    //     this.usersService.create(body.email,body.password)
    // }

    // Interceptor -> can mess around with incoming requests and/or outgoing response -> we can think asa middleware -> we can have many interceptor that intercepts incoming request or outgoing response as we want
    // Interceptor -> whenever we applied interceptor we could apply  either to route level or controller level or globally level 
    // {
    //     "id": 1,
    //     "email": "asd@gmail.com",
    //     "password": "90" -> (must be removed password property in response) !!!
    //                      -> right now we can get the particular user, so now our response include the password of user definitely not a property we want to include inside the response  !!!
    //                      ### Find by id
    //                      GET http://localhost:3000/auth/1
    //                      -> remember we are going to eventually encrypt our password before we stored inside db we haven't done yet this 
    //                      -> noneless even after encrypting this password property we still don't want sent back inside the response  so we need to make sure whenever we sent user back we edit out password property or remove password property
    // option 1 -> not flexible (nest ineterceptor)
    //                      -> we gonna follow Nest what we should do to remove password property 
    //                          -> we gonna use interceptor decorator class serializer interceptor (UseInterceptors and ClassSerializerInterceptor) and class-transformer libs (Exclude decorator)  to intercept outgoing response 
    //                          -> in the controller we gonna define interceptor decorator -> built in tool from Nest that allow us to intercept incoming request for outgoing response and mess around them someway, in this case we gonna intercept outgoing response -> we gonna take User entity returned from service and turn out the User entity to plain object based on the rule we setup inside User entity itself (Exclude decorator from class-transformer at users.entity.ts)  
    // }
    // option 2 -> flexible (custom interceptor)
    // DTO : in Nest we could defined DTO as handling incoming request
    // DTO : in general other framework -> DTO also use for formatting outgoing data as well from service -> we are going to create custom User DTO that describe exactly how we format User entity in other word what property we want to include for every particular route handler
    // DTO : ex: maybe for one is admin route case and second is public route case   
    
    // option 1 -> not flexible (nest interceptor)
    // @UseInterceptors(ClassSerializerInterceptor)
    // option 2 -> flexible (custom interceptor)
    // @UseInterceptors(SerializeInterceptor) // (room improvement) -> we gonna make reusable code for custom SerializeInterceptor instead only using UserDto before, in case : there PhotoDto want to use instead UserDto
    // @UseInterceptors(new SerializeInterceptor(UserDto)) // by telling specifically UserDto for serialization
    // @Serialize(UserDto) // (refactor) -> we are going to try refactor or creating something new for last long line interceptor code -> we gonna create our own custom decorator -> this custom decorator is gonna run exactly like @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(
        @Param('id') id:string
    ) {
        console.log("TODO 2 : I'm the route handler/ request handler is running") // option 2 -> flexible (custom interceptor) -> 2nd sequence order
        const user = await this.usersService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException('user not found')
        } 
        return user
    }

    // @Serialize(PhotosDto) // (optional more refactor) remember you 2 different type request handler or route handler and  want to costumize serialize dto instance for each of them -> remove Serialize decorator from controller and put Serialize decorator to each of route handler needed with differet kind of ..Dto rule 
    @Get('/')
    findAllUsers(
        @Query('email') email:string
    ) {
        return this.usersService.find(email)
    }

    @Patch('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() body:UpdateUserDto
    ) {
        return this.usersService.update(parseInt(id),body)
    }

    @Delete('/:id')
    deleteUser(
        @Param('id') id:string
    ) {
        return this.usersService.remove(parseInt(id))
    }


    
}
