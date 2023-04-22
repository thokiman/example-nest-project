// So remember, this is going to be something that allows us to prevent access to certain controllers
// or route handlers based upon whether or not the user is signed in.
// A guard in general is implemented by creating a class.
// This class must have a method called canActivate.
// This method is going to be called automatically any time there's an incoming request.
// And our goal is to look at that request and either return a truth value or falsy value.
// If we return a value that is truthy in nature, then the request can go through.
// Otherwise, if returned something that is falsey, such as undefined, null, zero, empty, string,
// false and so on, then the request will be automatically rejected.


import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";


export class AuthGuard implements CanActivate {
    // CanActivate is an interface once again, very similar to interfere to interceptors.
    // This is just going to make sure that we define all the appropriate functions on our class so that it
    // actually will behave as a guard correctly.

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // This is the third time we've seen ExecutionContext argument type.
        // So remember, this is very similar to kind of like a request coming in to an HTTP based application.
        // The reason we've got this execution context, as opposed to a plain request, is because this off guard
        // in theory could be used with different communication protocols.

        // So now, instead of here, we need to take a look at that incoming request and then we can decide whether
        // or not to allow the request through.
        // So in our case, we want to reject the request if the user is not signed in.   

        const request = context.switchToHttp().getRequest()
        
        return request.session.userId  
        // we return a value that is truthy in nature, then the request can go through
        // Otherwise, if returned something that is falsey, such as undefined, null, zero, empty, string,
        // false and so on, then the request will be automatically rejected. 
    }

}