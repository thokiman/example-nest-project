import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.entity'


// try to use Exception that built in Nest because automatically create response if any error happen instead common Error
// Nest repsonse if any error: 
// {
//     "statusCode": 404,
//     "message": "user not found",
//     "error": "Not Found"
//   }

// you can use throw error at service or controller, but good pattern if use in service because another controller can use same exception from same service that had been integrated
// throwing error at service or controller have same output response, but make sure at controller `return` keyword !!! is defined if there is no `return` keyword controller then there is built in error response from Nest 
// if you want to return built in json response from Nest, you need to use built in exception that Nest exception function defined
@Injectable()
export class UsersService {
    // 2nd option for best pattern
    constructor(
        @InjectRepository(User) private repo: Repository<User>
        // private keyword : we can abbreviate that property definiton assignment just like first option
        // Repository<User> : type annotation is Repository we applied generic type of User -> it means `repo` is gonna be instance of type Repository and deals with instance of User or this Repository type gonna handle User entity
        // @InjectRepository(User) : little bit aid of depedency injection system gonna tell depedency injection system that is what going to tell depedency injection system that we need User of type Repository -> this depedency injection use this type Repository<User> that will figure it out what instance we need to be inject UsersService class at runtime, unfortunately DI system is not working nicely if only use generic type Repository<T> instead use specified type Repository<User> -> this is why we need to tell type User at Repository 
        // @InjectRepository(User) : is required generic type of Repository<User>
    ) { }

    // 1st  option for better pattern
    // repo: Repository<User>

    // constructor(repo:Repository<User>){
    //     this.repo=repo
    // }

    create(email: string, password: string) {
        // 1st option  is good pattern because can call hook to do something after transaction happened 
        // 1st option good pattern : user entity instance
        const user = this.repo.create({
            email,
            password
        })
        // 1st option : persist user entity from create method to db
        return this.repo.save(user)

        // 2nd option not good pattern : directly persist user object to db
        // return this.repo.save({email, password})

    }

    findOne(id: number) {
        if (!id) {
            return null
        }
        // Find one and return object
        return this.repo.findOne({ where: { id } })
    }

    find(email: string) {
        // Find and return array
        return this.repo.find({ where: { email } })
    }


    async update(id: number, attrs: Partial<User>) {
        // Partial : is type helper that defined in typescript itself, this Partial type of attrs can any object that at least or None some of properties User class
        // Partial : we provide any object that provide has no properties, one properties ex: email, or all the properties of User is valid argument
        // Partial : but if we provide the property that doen't belong to User then it is gonna be TypeError ex: {color}, color property is not belong to User so it gonna be error
        // Partial : argument that can be used after using typehelper Partial -> {}, {email}, {password}, {email, password} instead mentioned as type User with no Partial, you must provide {email, password} if doesn't provide it gonna be TypeError
        // Partial : Partial is a good way for pattern because this is putting up away for update function, we have now got some type checking typescript we are only try update propertes that belong to User, or None 

        // save method : apply for update too other than create to persist data at db

        const user = await this.repo.findOne({ where: { id } }) // return User entity in db
        if (!user) {
            throw new NotFoundException('user not found')
        }
        // modify the user by copying attrs obj to existing user
        Object.assign(user, attrs)
        // persist to db
        return this.repo.save(user)

    }

    async remove(id: number) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return this.repo.remove(user)
    }

    
}


// good pattern : 
// 1. find the id -> return entity
// 2. modify the entity if any
// 3. remove, save, update entity to db