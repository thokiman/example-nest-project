import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { User } from "../users/users.entity"

@Entity()
export class Report {

    @PrimaryGeneratedColumn()
    id: number

    @Column({default: false}) // So to make sure that's always the case, I'm going to add in an option to the column decorator. -> I'm going to put in an object with a default property of false choice. -> That means that by default, if we do not set approved to some value, when we create a brand new report approved, we'll be given a default value of false.
    approved: boolean

    @Column()
    price: number

    @Column()
    make: string

    @Column()
    model: string

    @Column()
    year: number

    @Column()
    lng: number

    @Column()
    lat: number

    @Column()
    mileage: number

    @ManyToOne(
        () => User, // in time, we have to tell type TypeORM what kind of user,  our record is going to be associated with. So that's really the goal of the first argument. We're saying our report is going to be associated with something of type user. 
        (user) => user.reports // The use case of the second argument is very, very particular comes down to how TypeORM internally models relationships between different entities and does validation of how all these relationships are set up.
        // ^ Naturally, inside of our report entity, it's the opposite. So inside the report entity, we go from a user back to a list of reports.
        )
    user: User
}