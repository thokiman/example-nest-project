import { ExecutionContext, createParamDecorator } from '@nestjs/common';


// automatically tell a handler who the currently signed in user is -> interceptor + decorator

// final goal in controller can do :
// @Get('/whoami')
// whoAmI(
//     @CurrentUser() user:User // automatically get callback who currently signed in user is in controller  
// ) {
//     return user
// }

export const CurrentUser =  createParamDecorator(
    (data:never, context:ExecutionContext) => { // wrapper of around incoming request
        // so inside this function, we're going to write out some amount of logic to inspect the incoming request, that's what this context argument essentially is.
        
        // The reason it's referred to as an execution context as opposed to just simply request, is that ExecutionContext
        // thing, ExecutionContext object right here can be used to kind of abstract a WebSocket incoming message, jRPC.
        // request and HTTP request, a lot of different incoming kinds of requests.
        // So rather than specifically calling ExecutionContext thing as Requests, which would kind of imply that we're making
        // use of HTTP, it is instead called execution context, and that allows us to write some code that might
        // work equally well with WebSocket, jRPC, HTTP, GraphQL or any other kind of communication protocol.
        // But effectively, at the end, the day, ExceutionContext is the incoming request.
        console.log('\nCurrentUser decorator called -> data : ', data)
        console.log('CurrentUser decorator called -> context : ', context)
        
        // data: any argument : 
        // final goal in controller can do :
        // @Get('/whoami')
        // whoAmI(
        //   @CurrentUser('123') -> this is going the data argument is going to contain any data or any argument that we provide to our decorator when we actually make use of it.  
        //                  ^fill this argument  and will be show up at data:any argument in CurrentUser decorator function
        //                  ^ so data : any arg = '123'
        //   user:User // automatically get callback who currently signed in user is in controller  
        // ) {
        //     return user
        // }

        // `never`
        //   ^This value is never going to be used, accessed in any way, shape or form 
        //  as soon as we change that to `never` keyword back inside of our users controller.
        //  I'm now getting an error around providing '123' right here.
        //  So that type annotation of `never` is a good signal to everyone else making use of our decorator that way.
        //  say : `Don't give our decorator any arguments because it doesn't need them`. 
        
        const request = context.switchToHttp().getRequest() // So that is going to give us the underlying request that is coming into our application.
        console.log('CurrentUser decorator called -> request : ', request)
        console.log('CurrentUser decorator called -> request.session.userId : ', request.session.userId)
        
        return request.currentUser       
    }
)