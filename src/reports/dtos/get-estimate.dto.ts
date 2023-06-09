import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude
} from 'class-validator'
import { Transform } from 'class-transformer'
// This transformed decorator is going to allow us to receive an incoming value, such as, say, a string from the incoming request 
// and then do some processing on it or transformation on it and allow us to
// return that value into some other kind of value before it ever gets assigned and validated on ourt DTO.

export class GetEstimateDto {
    
    @IsString()
    make:string
    
    @IsString()
    model:string

    @Transform(({value})=> parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year:number
    
    @Transform(({value})=> parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage:number
    
    @Transform(({value})=> parseFloat(value))
    @IsLongitude()
    lng:number

    @Transform(({value})=> parseFloat(value))
    @IsLatitude()
    lat:number
    
}