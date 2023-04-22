import { Expose } from "class-transformer"
// this DTO is for interceptor
// general idea : this would be similiar like other DTO we put together 
// the difference for dto interceptor :
// 1. this time around we gonna list out property inside of UserDto that we want to include in output response
// 2. we also are not gonna to additional any validation to DTO cause we don't want to validate outgoing data
// 3. we gonna list out all different properties, that I want to share in output response

export class UserDto{
    // Expose decorator/ directive : `hey this property is going to include in output response`
    // Expose decorator/ directive : means do share this property
    // Exclude decorator/ directive : means do not share this property

    // Expose decoreator/ directive : so inside our DTO say `Here is our properties that I want to sent out inside response`
    @Expose()   
    id:number
    @Expose()
    email:string
}
