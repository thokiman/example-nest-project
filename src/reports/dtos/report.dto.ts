import {Expose, Transform} from 'class-transformer'
import { User } from '../../users/users.entity'

export class ReportDto {
    
    @Expose()
    id:number
    
    @Expose()
    price:number
    
    @Expose()
    year:number
    
    @Expose()
    lng:number
    
    @Expose()
    lat:number
    
    @Expose()
    make:string

    @Expose()
    model:string
    
    @Expose()
    mileage:number

    // (approval feature)
    @Expose()
    approved:boolean


    // Original ReportDTO
    // have user object {id:... , email: ..., password: ...} but we alread hide it before using seriliaze, and annotation try to pull original ReportDTO again to create new brandly new property called userId 

    // So let me help you understand what's going on here.
    // Remember, the entire purpose of the ReportDto is to take a report entity instance and convert it into an object that has all these different properties.
    // During that conversion, we can choose to obviously exclude certain properties and we just do that by
    // not marking those properties of the exposed directive.
    // But we can also add in brand new properties as well to generate a new property that is going to pull
    // some information from the original report entity.
    // We're going to use the transform decorator.
    @Transform(({ // The transformed decorator is going to be called with a function, we're going to d structure off the argument list.
        obj // We're going to pull out something called object. `obj` is a reference to the original report entity. So we're going to pull in that original report entity .
    })=>obj.user.id) // -> So this entire line ({obj}) => {} says `take the original report entity that we're currently trying to format to using ReoirtDTI`.
                     // -> Look at its user property and look at that users ID, so take that value and assign it to this brand
                     // -> new property that you and I are adding in called userId that's are going to get the users ID inside of your.
    @Expose()
    userId: number
}