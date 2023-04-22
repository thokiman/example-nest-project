// (option2) -> flexible (custom interceptor) 
// custom interceptor -> serialize interceptor -> because it is going to take an object and then serialize into json

import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass } from "class-transformer";

// `implements` keyword : does not stand for `extends` keyword 
// `extends` keyword : we make use of extends whenever subclassing an existing class
// `implements` keyword : we make use of implements whenever any time we want to create new class that satisfy all requirement of either abstract class or interface

export class SerializeInterceptor implements NestInterceptor{ // (room improvement) -> we need to make couple improvement we need to make sure that our interceptor is not always harcoded to UserDto  

    constructor(
        private dto:any 
    ) {} // (room improvement) -> make sure that our interceptor is not always harcoded to UserDto


    // by  NestInterceptor interface : typescript is gonna check all the method in the exist NestInterceptor interface then it is going to make sure that our class properly implements all different method
    // so in this case : we must define method called `intercept`
    
    // general requirement for implementing NestInterceptor is intercept method
    // only requirement inside of custom interceptor class is going to define a method that specifically intercepts 

    // intercept method that implement NestInterceptor 
    // -> this method will be called automatically anytime our interceptors need to run so handle incoming request or outgoing response 
    
    // intercept(context: ExecutionContext, handler (request handler ref): CallHandler<any>): Observable<any> | Promise<Observable<any>>
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // context : essentially wrapper of information on incoming request
        // next : kind of / somewhat like/ actual route handler inside condtroller -> this is not exactly route handler -> it is actually rxjs Observable -> but the purpose of this case is somewhat like route handler or kind of a reference to the request handler in our controller  
        
        // what you really need to know about intercept method is if you ever run some code before a request goes into request handler/ route handler then it is going to place code at intercept method
        // `Run something before a request is handled by route handler/ request handler`
        console.log("TODO 1 : I'm running before the route handler/ request handler") // // option 2 -> flexible (custom interceptor) -> 1st sequence order
        console.log('TODO 1 : If you want to do something before request is handled -> put the code right here !!!')
        console.log('TODO 1 : SerializeInterceptor -> intercept -> context arg : ',context)

        return next.handle().pipe(
            map((data:any)=>{
                // data arg : this data is what we are going to sent back on outgoing response  
                // `Run something before the response is sent out`
                console.log("TODO 3 : I'm running before response is sent out")
                console.log('TODO 3 : If you want to do something before response is sent out for the outgoing data -> put the code right here !!!') // option 2 -> flexible (custom interceptor) -> 3rd sequence order
                console.log('TODO 3 : SerializeInterceptor -> intercept -> return next -> data arg : ',data)
                // data : User { id: 1, email: 'asd@gmail.com', password: '90' } -> this format means we are still working with an User instance entity inside interceptor instead plain object  
                // normally whenever we finish our request/route handler or we finish our interceptor -> nest gonna take whatever comes out all the stuff and turn any to json for us
                // so usually in nest this `User {` entity instance will be turn into json
                // we gonna highjack nest process when entity instance automatically turn into json -> how?
                // 1. we gonna take `User {` entity instance -> we are going to convert it to UserDto instance 
                // 2. this UserDto instance thing is gonna have all different serialization rules, in this case : rules that say `I want you show id and email, but no password property 
                // UserDto : DTO that describe how to serialize a user for this particular route handler
                // 3. then we are going to directly return that UserDto instance  
                // 4. nest is gonna take that UserDto instance and then turn UserDto instance automatically and sent back to response   
                // data arg : incoming of UserEntity instance from service -> turn UserEntity instance, data arg convert into plain object -> we gonna use plainToClass 
                // the converter is serializer that has been custom defined as UserDto
                
                // (room improvement) -> intercept method always use hardcoded UserDto -> not a good idea -> we might want SerializeInterceptor in diffent location inside our app ex : for photos instead of user -> so we will make code more reusable
                // return plainToClass(
                //     UserDto, 
                //     data, 
                //     {
                //         excludeExtraneousValues:true // this setting here absolutely key to make sure every works as expected, ensure whenever we have UserDto instance and try to turn UserDto instance into plain json -> it is only going to share or expose the different properties that specifically mark from @Expose decorator/directive -> so any other properties is going to remove it immediately and this is because excludeExtraneousValues value
                //         // if we don't include excludeExtraneousValues beyond there then any other property inside of UserDto would be share to outgoing response
                //     })

                return plainToClass( // (room improvement) -> make sure that our interceptor is not always harcoded to UserDto
                    this.dto, 
                    data, 
                    {
                        excludeExtraneousValues:true 
                    })
            })
        )
    }
}

// (safety interceptor) -> dto:any -> applying `any` kind of type safety is real challenging because lack of catch error
// (safety interceptot) -> dto:any -> how?
// 1. we make sure whatever we pass to dto must be a class -> make validator of ClassContructor interface
interface ClassConstructor {
    new (... args:any[]):{}
}

export function Serialize(dto: ClassConstructor) { // (refactor) -> gonna create custom decorator
    return UseInterceptors(new SerializeInterceptor(dto))
}
