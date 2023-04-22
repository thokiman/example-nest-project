import {
    AfterUpdate,
    AfterRemove,
    AfterInsert,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm'
import { Report } from '../reports/report.entity'
// option 1 -> not flexible (nest interceptor)
// import { Exclude } from 'class-transformer'


@Entity() // to look or model this class of User
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    // option 1 -> not flexible (nest interceptor)
    // Exclude decorator -> this is gonna create setup rules how take User entity instance type to plain object type
    // Exclude decorator -> in this case is password property -> whenever we have taken instance of User entity turn then into plain object and then to json -> just Exclude the passowrd property 
    // @Exclude() 
    @Column()
    password: string

    @Column({default : true})
    admin:boolean

    // (Association one to many)
    @OneToMany(
        () => Report, // in time, we have to tell type TypeORM what kind of record, our user is going to be associated with. So that's really the goal of the first argument. We're saying our user is going to be associated with something of type report. 
        (report) => report.user // The use case of the second argument is very, very particular comes down to how TypeORM internally models relationships between different entities and does validation of how all these relationships are set up.   
            // ^ All you need to understand about the second argument is that it's going to be a function that's going to take an instance of the entity that you're trying to relate to.
            //  So in the user.entity file, you would take an instance of a report and then we're going to return how to go
            //  from that target entity instance back to the entity that we are currently defining, which is in our case right now, the user, because I'm in the user.entity file.
        )
    reports: Report[]


    // For debug purpose or some kind business logic after transaction happened, do this!!!

    // hook : a function that walk out every function that is going to be User table db
    // hook : we want to log every action crud operation inside typeorm model
    // hook : hook from typeorm allowing us to define function of User entity will be called at certain amount of time 
    // AfterInsert : this is decorator that can be applied to method inside of our entity
    @AfterInsert() // every time we goona insert User to database the logInsert method gonna be executed
    logInsert() {
        console.log('Inserted User with id', this.id) // `this` keyword goona be reference this entity that just inserted 
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('Remove User with id', this.id)
    }
}